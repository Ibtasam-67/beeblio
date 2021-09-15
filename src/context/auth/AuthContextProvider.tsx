import React, { useReducer, Dispatch, useContext, useState } from "react";
import AuthReducer from "./AuthReducer";
import axios from "axios";
import {
  AUTH_LOGIN,
  CLEAR_CURRENT_USER_TOKEN,
  HTTP_ERROR,
  LOADER,
  UPDATE_PROFILE,
} from "../types";
import { createContext } from "react";
import { authAxios } from "../../api/authApi";
import { AlertContext } from "../alert/AlertContextProvider";

// Create Context
const initialState = {
  currentUserToken: "",
  error: false,
  loading: false,
  loginByEmail: (user: any) => {},
  getPaymentInfo: (data: any) => {},
  resetError: () => {},
  updateProfile: () => {},
  profileUpdated: false,
  clearCurrentUserToken: () => {},
};
export const AuthContext = createContext(initialState);

// Provider Component
export const AuthContextProvider = (props: any) => {
  const alertContext = useContext(AlertContext);

  const [state, dispatch] = useReducer(AuthReducer, initialState);

  // LOGIN FUNCTION
  const loginByEmail = async (User: any) => {
    try {
      dispatch({
        type: LOADER,
        payload: true,
      });
      const result = await axios.post(
        `${process.env.REACT_APP_BASE_URL}/auth/login`,
        User
      );

      console.log("result in authContextProviders", result);

      localStorage.setItem("currentUserToken", `Bearer ${result.data.token}`);

      const userResult = await authAxios.get(
        `${process.env.REACT_APP_BASE_URL}/user/me`
      );
      localStorage.setItem("currentUser", JSON.stringify(userResult.data));
      alertContext.clearAlert();
      dispatch({
        type: AUTH_LOGIN,
        payload: result.data,
      });
      dispatch({
        type: LOADER,
        payload: true,
      });

      return {
        loginInfo: result.data,
        meInfo: userResult.data,
      };
    } catch (err) {
      const { response } = err;
      alertContext.setWarningAlert(
        "Email or password does not match. Please try again."
      );
      dispatch({
        type: LOADER,
        payload: true,
      });
      dispatch({
        type: HTTP_ERROR,
        payload: true,
      });
    }
  };

  const resetError = () => {
    dispatch({
      type: HTTP_ERROR,
      payload: false,
    });
  };

  const clearCurrentUserToken = () => {
    dispatch({
      type: CLEAR_CURRENT_USER_TOKEN,
      payload: null,
    });
  };

  const updateProfile = () => {
    dispatch({
      type: UPDATE_PROFILE,
      payload: true,
    });
  };

  const getPaymentInfo = async (data: any) => {
    try {
      dispatch({
        type: LOADER,
        payload: true,
      });
      const result = await authAxios.get(
        `${process.env.REACT_APP_BASE_URL}/company/${data.meInfo.roles[0].company.id}`
      );

      return {
        dataFromGetPaymentInfo: result.data,
      };
    } catch (err) {
      const { response } = err;
      console.log("response in getPaymentInfo", response);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUserToken: state.currentUserToken,
        error: state.error,
        loading: state.loading,
        profileUpdated: state.profileUpdated,
        loginByEmail,
        getPaymentInfo,
        updateProfile,
        resetError,
        clearCurrentUserToken,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
