import Router, { useRouter } from "next/router";
import { destroyCookie, parseCookies, setCookie } from "nookies";
import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from "../services/api";

interface SignInCredentials {
    email: string,
    password: string,
}
interface AuthContextData{
    signIn(credentials: SignInCredentials): Promise<void>,
    user: User | undefined,
    isAuthenticated: boolean,

}

interface AuthProviderProps {
    children: ReactNode,
}

interface User {
    email: string,
    permissions: string[],
    roles: string[],
}

export const AuthContext = createContext({} as AuthContextData)

export const signOut = () =>{
    destroyCookie(undefined, 'nextauth.token');
    destroyCookie(undefined, 'nextauth.refreshToken');

    Router.push('/');
}

export function AuthProvider({children}: AuthProviderProps){
    const router = useRouter();
    const [user, setUser] = useState<User>();
    const isAuthenticated = !!user;

    useEffect(() => {
        const {'nextauth.token': token} = parseCookies();
        
        if(token){
            api.get('/me').then(response =>{
                const {email, permissions, roles} = response.data;
                setUser({email, permissions, roles});
            
            }).catch(() => {
                destroyCookie(undefined, 'nextauth.token');
                destroyCookie(undefined, 'nextauth.refreshToken');

                router.push('/');
            })
        }
    },[])

    const signIn = async ({email, password}: SignInCredentials) => {
        try{
            const response = await api.post('sessions',{
                email, 
                password
            })
            const {token, refreshToken, permissions, roles}  = response.data;
        
            setCookie(undefined, 'nextauth.token', token, {
                maxAge: 60*60*24*30, //30 dias
                path: '/',

            });
            setCookie(undefined, 'nextauth.refreshToken', refreshToken, {
                maxAge: 60*60*24*30, //30 dias
                path: '/',
                
            });

            setUser({
                email,
                permissions,
                roles,
            })

            api.defaults.headers.common['Authorization'] = token;
            router.push('/dashboard');
        } catch(err){
            console.log(err);
        }
    }

    return(
        <AuthContext.Provider value={{signIn, isAuthenticated, user}}>
            {children}
        </AuthContext.Provider>
    )
}