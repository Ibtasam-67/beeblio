import {
    AUTH_LOGIN, CLEAR_CURRENT_USER_TOKEN, HTTP_ERROR, LOADER, UPDATE_PROFILE
} from '../types';

export default (state: any, action: any) => {
    switch (action.type) {
        case AUTH_LOGIN:
            return {
                ...state,
                currentUserToken: action.payload,
            };
        case HTTP_ERROR:
            return {
                ...state,
                error: action.payload
            };
        case LOADER:
            return {
                ...state,
                loading: action.payload
            };
        case UPDATE_PROFILE:
            return {
                ...state,
                profileUpdated: action.payload
            };
        case CLEAR_CURRENT_USER_TOKEN:
            return {
                ...state,
                currentUserToken: action.payload
            };
        default:
            return state;
    }
};