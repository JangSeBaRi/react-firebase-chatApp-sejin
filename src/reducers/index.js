import { combineReducers } from 'redux';
import user from './user';
import chat from './chat';

const appReducer = combineReducers({
    user,
    chat,
})

const rootReducer = (state, action) => {

    return appReducer(state, action);
};

export default rootReducer