// crate user context 
import { createContext } from 'react';

const user={
    userName: "default user",
    email: "default@gmail.com",
    password:"000000",
    role:"user",
    firstName:"default",
    lastName:"user",
    avatar: "",
    projects:[],
}


export const UserContext = createContext({user, setUser:()=>{}});
