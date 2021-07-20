import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { setJwtToken } from '../reducers/user';

const Home = () => {

    const dispatch = useDispatch();
    const jwtToken = useSelector((state: any) => state.user.jwtToken);

    const updateJwtToken = () => {
        const makeid = (length: number) => {
            var result = '';
            var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            var charactersLength = characters.length;
            for (var i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
        dispatch(setJwtToken(makeid(5)));
    }

    return <div>
        <div>{jwtToken}</div>
        <div onClick={(e: any) => {
            updateJwtToken();
        }}>update jwtToken</div>
    </div>
}

export default Home