import { createContext, useState } from "react";



export const APIContext = createContext({
    auth: false,
    setAuth: () => {}
})

export function useAPIContext() {
    const [auth, setAuth] = useState(false);
    return {
        auth, setAuth
    };
    
}