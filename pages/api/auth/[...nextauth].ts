import * as jwt from "jsonwebtoken";
import axios from "axios";
import NextAuth from "next-auth/next";
import Credentials from "next-auth/providers/credentials";
import dayjs from "dayjs";
import { SHOESMARK_API_DOMAIN } from "../../../config/domain";
import { signOut } from "next-auth/react";

function extractUserData(token:string){
    const {exp, userId, isActive, role}:any = jwt.decode(token);
    return {
        id: userId,
        isActive,
        role,
        expiredAt: exp
    }
}

async function refreshToken(refreshToken: string){
    try{
        const request = await axios.post(SHOESMARK_API_DOMAIN + "/auth/refresh", {
            refreshToken
        }, { headers: {"Content-Type":"application/json"}});
        if(request.status==201){
            console.log("Refresh successed");
            return request.data.data;
        }
    }catch(e){console.log(e);}
    return null;
}



export default NextAuth({
    providers:[
        Credentials({
            name:"Tài khoản ShoesMark",
            credentials:{
                username:{label:"Username", type:"text", placeholder:"Tên đăng nhập hoặc email"},
                password:{label:"Password", type:"password"}
            },
            async authorize(credentials, req){
                try{
                    const request = await axios.post(SHOESMARK_API_DOMAIN + "/auth/login", {
                        username: credentials?.username,
                        email: credentials?.username,
                        password: credentials?.password
                    }, {headers: {"Content-Type":"application/json"}});
                    if(request.status == 201){
                        return request.data.data;
                    }
                }catch{}
                return null;
            }
        })
    ],
    callbacks:{ 
        async jwt({token, user}){
            if(user){
                token = {
                    ...token,
                    user: {
                        ...user,
                        ...extractUserData(user.accessToken)
                    }
                }
            }
            if(dayjs() > dayjs.unix(token.user.expiredAt)){
                const data = await refreshToken(token.user.refreshToken);
                if(data!=null){
                    token = {
                        ...token,
                        user: {
                            refreshToken: data.refreshToken,
                            accessToken: data.accessToken,
                            ...extractUserData(data.accessToken)
                        }
                    }
                }
                else {
                    token.error = "RefreshAccessTokenError";
                }
            }
            return token;
        },
        async session({session,token,user}){
            session.user = token.user;
            session.error = token.error;
            return session;
        }
    }
});