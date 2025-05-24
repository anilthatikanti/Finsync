import { onAuthStateChanged, type User } from "firebase/auth"
import { createContext, useContext, useEffect, useState } from "react"
import { auth } from "../services/firebase";

const authContext = createContext<{user:User|null,loading:boolean}>({user:null,loading:true});
export const useAuth =()=> useContext(authContext)

export const AuthProvider = ({children}:{children:React.ReactNode})=>{
    const [user,setUser] = useState<User|null>(null)
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
            setLoading(false); // done checking auth status
          });
          return () => unsubscribe();
    },[])

    return <>
    <authContext.Provider value={{user,loading}}>
        {children}
    </authContext.Provider>
    </>
}