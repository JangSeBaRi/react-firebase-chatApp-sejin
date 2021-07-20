export const SET_CURRENT_CHAT_ROOM = "SET_CURRENT_CHAT_ROOM";


export const setCurrentChatRoom = (currentChatRoom) => ({
    type: SET_CURRENT_CHAT_ROOM,
    payload: currentChatRoom,
});

const initialState = {
    currentChatRoom: null,
};

const chat = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENT_CHAT_ROOM: {
            return {
                ...state,
                currentChatRoom: action.payload,
            };
        }

        default:
            return state;
    }
};

export default chat;
