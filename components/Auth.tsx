import { signIn, signOut, useSession } from "next-auth/react";
import React, { useEffect } from "react";

export interface AuthOptions{
    role?: Array<"admin" | "user" | "employee" | string>
}
interface AuthProps{
    children?: React.ReactNode, 
    auth?: AuthOptions
}
const Auth: React.FC<AuthProps> = ({ children, auth }) => {
    const session = useSession({required: auth!==null && auth!==undefined});
    useEffect(() => {
        if(session.status == "loading") return;
        if (auth && auth.role && auth.role.length > 0) {
            if (session.data && session.data.user) {
                if (auth.role.indexOf(session.data.user.role) == -1) {signIn()}
            }
            if(session.data?.error){signIn()}
        }
        else if(session.data?.error){signOut()}
    }, [session, auth]);
    return (
        <>{
            session.status == "loading" || (auth && session.data?.error)?
            <></>
            :
            children
        }</>
    )
}
export default Auth;