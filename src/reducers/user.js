export const SET_JWT_TOKEN = "SET_JWT_TOKEN";
export const SET_USER_PROFILE = "SET_USER_PROFILE";
export const SET_PHOTO_URL = "SET_PHOTO_URL";
export const SET_IS_LOADING = "SET_IS_LOADING";
export const CLEAR_USER = "CLEAR_USER";

export const setJwtToken = (jwtToken) => ({
    type: SET_JWT_TOKEN,
    payload: jwtToken,
});

export const setUserProfile = (userProfile) => ({
    type: SET_USER_PROFILE,
    payload: userProfile,
});

export const setPhotoURL = (photoURL) => ({
    type: SET_PHOTO_URL,
    payload: photoURL,
});

export const setIsLoading = (isLoading) => ({
    type: SET_IS_LOADING,
    payload: isLoading,
});

export const setClearUser = () => ({
    type: CLEAR_USER,
});

const initialState = {
    jwtToken: "",
    userProfile: "",
    isLoading: false,
};

const user = (state = initialState, action) => {
    switch (action.type) {
        case SET_JWT_TOKEN: {
            return {
                ...state,
                jwtToken: action.payload,
            };
        }

        case SET_USER_PROFILE: {
            return {
                ...state,
                userProfile: action.payload,
            };
        }

        case SET_PHOTO_URL: {
            return {
                ...state,
                userProfile: {
                    ...state.userProfile,
                    photoURL: action.payload,
                },
            };
        }

        case SET_IS_LOADING: {
            return {
                ...state,
                isLoading: action.payload,
            };
        }

        case CLEAR_USER: {
            return {
                ...state,
                jwtToken: "",
                userProfile: "",
            };
        }

        default:
            return state;
    }
};

export default user;
