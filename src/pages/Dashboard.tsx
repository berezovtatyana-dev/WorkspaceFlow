import React, {useContext, useState} from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

interface BookingRecord {
    id: string;
    resourceName: string;
    time: string;
    date: string;
    status: 'Confirmed' | 'Cancelled';

}

export const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const userCtx = useContext(UserContext);
    if (!userCtx) throw new Error("UserContext не найден");
    const {user} = userCtx;
    const [upcoming] = useState<BookingRecord[]
    return(
        <div>
            Бронирование
        </div>
    );
};