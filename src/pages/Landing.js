import React from 'react';
import { Link, useHistory } from 'react-router-dom';

const Landing = () => {
    const history = useHistory();
    return <div>
        <div onClick={(e: any) => {
            // console.log(e)
            history.push("/user/users/login");
        }}>Go to Login</div>
    </div>
}

export default Landing