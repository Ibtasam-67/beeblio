import {
    HTTP_ERROR, HTTP_SUCCESS, NEW_ALERT, CLEAR_ALERT, HTTP_WARN, HTTP_INFO
} from '../types';

export default (state: any, action: any) => {
    switch (action.type) {
        case HTTP_SUCCESS:
            return {
                ...state,
                type: 'success',
                message: action.payload,
            };
        case HTTP_ERROR:
            return {
                ...state,
                type: 'error',
                message: action.payload
            };
        case HTTP_WARN:
            return {
                ...state,
                type: 'warn',
                message: action.payload
            };
        case HTTP_INFO:
            return {
                ...state,
                type: 'info',
                message: action.payload
            };
        case NEW_ALERT:
            return {
                ...state,
                newAlert: action.payload
            };
        case CLEAR_ALERT:
            return {
                ...state,
                newAlert: action.payload
            };
        default:
            return state;
    }
};