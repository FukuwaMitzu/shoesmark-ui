import { signIn, useSession } from "next-auth/react";
import React, { useEffect } from "react";

export interface AuthOptions{
    role?: Array<"admin" | "user" | "employee" | string>
}
interface AuthProps{
    children?: React.ReactNode, 
    auth?: AuthOptions
}
const Auth: React.FC<AuthProps> = ({ children, auth }) => {
    const ses = useSession({required: auth!==null && auth!==undefined});
    useEffect(() => {
        if(ses.status == "loading") return;
        if (auth && auth.role && auth.role.length > 0) {
            if (ses.data && ses.data.user) {
                if (auth.role.indexOf(ses.data.user.role) == -1) {signIn()}
            }
            if(ses.data?.error){signIn()}
        }
    }, [ses]);
    return (
        <>{
            ses.status == "loading" || (auth && ses.data?.error)?
            <></>
            :
            children
        }</>
    )
}
export default Auth;