// crate user context 
import { createContext } from 'react';

const user={
    username: "default user",
    email: "default@gmail.com",
    password:"000000",
    role:"user",
    firstName:"default",
    lastName:"user",
    projects:[],
}


export const UserContext = createContext({user, setUser:()=>{}});
