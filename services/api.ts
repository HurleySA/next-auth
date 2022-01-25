import axios, { AxiosError } from "axios";
import { parseCookies, setCookie } from "nookies";

interface failedRequestItem {
    onSucess: (token: string) => void,
    onFailure: (err: AxiosError) => void
}

let cookies = parseCookies();
let isRefreshing = false;
let failedRequestQueue: Array<failedRequestItem> = [];

export const api = axios.create({
    baseURL: 'http://localhost:3333',
    headers:{
        Authorization: `Bearer ${cookies['nextauth.token']}`
    }
})
//refreshToken
api.interceptors.response.use(response => {
    return response;
},(error: AxiosError) =>{
    if(error.response?.status === 401){
        if(error.response.data.code === 'token.expired'){
            cookies = parseCookies();

            const { 'nextauth.refreshToken': refreshToken} = cookies;
            const originalConfig = error.config;

            if(!isRefreshing){
                isRefreshing = true;

                api.post('/refresh', {
                    refreshToken,
                }).then(response =>{
                    const { token } = response?.data;
    
                    setCookie(undefined, 'nextauth.token', token, {
                        maxAge: 60*60*24*30, //30 dias
                        path: '/',
        
                    });
                    setCookie(undefined, 'nextauth.refreshToken', response?.data.refreshToken, {
                        maxAge: 60*60*24*30, //30 dias
                        path: '/',
                        
                    });
    
                    api.defaults.headers.common['Authorization'] = token;
                    
                    failedRequestQueue.forEach(request => request.onSucess(token))
                    failedRequestQueue = [];
                }).catch(err =>{
                    failedRequestQueue.forEach(request => request.onFailure(err))
                    failedRequestQueue = [];
                }).finally(() => {
                    isRefreshing = false;
                })
            }

            return new Promise((resolve, reject) => {
                failedRequestQueue.push({
                    onSucess: (token: string) => {
                        if (originalConfig.headers) {
                            originalConfig.headers['Authorization'] = `Bearer ${token}`;
                        }

                        resolve(api(originalConfig));
                    },
                    onFailure:(err: AxiosError) => {
                        reject(err)
                    },
                })
            })
        }else{

        }
    }
})