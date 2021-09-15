import React, { useReducer, Dispatch } from 'react';
import {
    HTTP_ERROR, HTTP_SUCCESS, NEW_ALERT, CLEAR_ALERT, HTTP_WARN, HTTP_INFO
} from '../types';
import { createContext } from 'react';
import AlertReducer from './AlertReducer';

// Create Context
const initialState = {
    type: '',
    message: '',
    setErrorAlert: (message: string) => { },
    setSuccessAlert: (message: string) => { },
    setWarningAlert: (message: string) => { },
    setInfoAlert: (message: string) => { },
    setnewAlert: () => { },
    clearAlert: () => { },
    newAlert: false
}

export const AlertContext = createContext(initialState);

// Provider Component
export const AlertContextProvider = (props: any) => {

    const [state, dispatch] = useReducer(AlertReducer, initialState);

    const setErrorAlert = (message: string) => {
        dispatch({
            type: HTTP_ERROR,
            payload: message
        });
        setnewAlert();
    }

    const setSuccessAlert = (message: string) => {
        dispatch({
            type: HTTP_SUCCESS,
            payload: message
        });
        setnewAlert();
    }

    const setInfoAlert = (message: string) => {
        dispatch({
            type: HTTP_INFO,
            payload: message
        });
        setnewAlert();
    }

    const setWarningAlert = (message: string) => {
        dispatch({
            type: HTTP_WARN,
            payload: message
        });
        setnewAlert();
    }

    const setnewAlert = () => {
        dispatch({
            type: NEW_ALERT,
            payload: true
        });
    }

    const clearAlert = () => {
        dispatch({
            type: CLEAR_ALERT,
            payload: false
        });
    }

    return (
        <AlertContext.Provider
            value={{
                type: state.type,
                message: state.message,
                setErrorAlert,
                setSuccessAlert,
                clearAlert,
                setnewAlert,
                setWarningAlert,
                setInfoAlert,
                newAlert: state.newAlert
            }}>
            {props.children}
        </AlertContext.Provider>
    );
};



