import {
    GET_FILTERED_CONTENT, HTTP_ERROR, SET_CURATED_CONTENT_URL, LOADER
} from '../types';

export default (state: any, action: any) => {
    switch (action.type) {
        case GET_FILTERED_CONTENT:
            return {
                ...state,
                filteredResults: Object.entries(action.payload).map(item => ({ word: item[0], number: item[1] })),
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
        case SET_CURATED_CONTENT_URL:
            return {
                ...state,
                curatedContent: action.payload
            }
        default:
            return state;
    }
};