import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";

interface BookingRecord {
    id: string;
    resourceName: string;
    resourceType: 'desk' | 'room';
    floor: number;
    time: string;
    date: string;
    hour: number;
    status: 'Confirmed' | 'Cancelled';
}

export const Profile: React.FC = () => {
    const UserCtx = useContext(UserContext);
    if (!UserCtx) throw new Error("UserContext не найден");
    const {user, refundHours} = UserCtx;
    const [bookings, setBookings] = useState<BookingRecord[]>(()=>{
        return JSON.parse(localStorage.getItem('user_bookings')||'[]');
    });
    const handleCancelBooking = (bookingId: string, hourToRefund: number) => {
        refundHours(hourToRefund);
        const updateBookings = bookings.map(b=>
            b.id === bookingId ? {...b, status: 'Cancelled' as const} : b
        );
        setBookings(updateBookings);
        localStorage.setItem('user_bookings', JSON.stringify(updateBookings));
    };
    
    return(
        <div>
            <div>
                <div>
                    <h1>{user.name}</h1>
                    <p>{user.department} * {user.role}</p>
                </div>
                <div>
                    Использовано лимита: {user.usedHours} ч. из {user.monthlyHourLimit} ч.
                </div>
            </div>
            <div>
                <h2>История ваших бронирований:</h2>
                {bookings.length === 0 ? (
                    <div>Вы еще ничего не бронировали</div>
                ) : (
                <div>
                    <table>
                        <thead>
                            <tr>
                                <th>Ресурс</th>
                                <th>Дата/время</th>
                                <th>Списание</th>
                                <th>Статус</th>
                                <th>Действие</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b)=>(
                                <tr key={b.id}>
                                    <td>
                                        <p>{b.resourceName}</p>
                                        <p>{b.floor} этаж * {b.resourceType === 'room' ? 'Переговорная' : 'Место'}</p>
                                    </td>
                                    <td>
                                        <p>{b.date}</p>
                                        <p>{b.time}</p>
                                    </td>
                                    <td>{b.hour} ч.</td>
                                    <td>{b.status === 'Confirmed' ? 'Подтверждено' : 'Отменено'}</td>
                                    <td>
                                        {b.status === 'Confirmed' && (
                                            <button
                                        onClick={handleCancelBooking(b.id, b.hour)}
                                        >
                                            Отменить
                                        </button>
                                    )}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                )
            }
        </div>
    </div>
    );
};