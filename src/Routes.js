import React, { useEffect } from 'react';
import {
    Route,
    Switch,
    useHistory
} from 'react-router-dom';
import { firebaseApp } from './firebase'
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import ChatList from './pages/ChatList';
import ChatRoom from './pages/ChatRoom';
import { useDispatch, useSelector } from 'react-redux';
import { setUserProfile, setIsLoading, setClearUser } from './reducers/user';
import Spinner from 'react-bootstrap/Spinner';


const Routes = () => {
    const history = useHistory();
    const dispatch = useDispatch();
    const isLoading = useSelector((state: any) => state.user.isLoading)

    //promise 적용
    const delay = (ms) => new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms);
    })

    useEffect(() => {
        (async () => {
            dispatch(setIsLoading(true))
            await delay(1000)
            firebaseApp.auth().onAuthStateChanged(user => {
                if (user) {
                    history.push("/chat/list");
                    dispatch(setUserProfile(user));
                } else {
                    history.push("/users/login");
                    dispatch(setClearUser());
                }
            });
            dispatch(setIsLoading(false))
        })()
    }, [dispatch, history])


    if (isLoading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh ' }}>
                <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                </Spinner>
            </div>
        )
    } else {
        return (
            <Switch>
                <Route exact path="/users/login" component={Login} />
                <Route exact path="/users/signup" component={SignUp} />
                <Route exact path="/chat/list" component={ChatList} />
                <Route exact path="/chat/chat/room/:roomId" component={ChatRoom} />
            </Switch>
        )
    }
};

export default Routes;