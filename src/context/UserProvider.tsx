import React, { useState } from "react";
import type {ReactNode} from 'react';
import { UserContext } from "./UserContext";
import type { User } from "./UserContext";


export const UserProvider: React.FC<{children: ReactNode}> = ({children}) => {
    const [user, setUser] = useState<User>({
        name: 'Татьяна Станкова',
        role: 'Admin',
        department: 'PRO',
        monthlyHourLimit: 20,
        usedHours: 0,
    });
    const deductHours = (hours: number): boolean => {
        if (user.usedHours + hours > user.monthlyHourLimit){
            return false;
        }
        setUser(prev => ({...prev, usedHours: prev.usedHours + hours}));
        return true;
    };
    const refundHours = (hours: number)=> {
        setUser(prev => ({...prev, usedHours: Math.max(0, prev.usedHours- hours)}));
    };
    return (
        <UserContext.Provider value={{user, deductHours, refundHours}}>
            {children}
        </UserContext.Provider>
    )
}