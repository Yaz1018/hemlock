import firebase from 'firebase';
import { Actions } from 'react-native-router-flux';
var md5 = require("crypto-js/md5");

import {
  EMAIL_CHANGED,
  PASSWORD_CHANGED,
  LOGIN_USER_SUCCESS,
  LOGIN_USER_FAIL,
  LOGIN_USER
} from './types';

export const emailChanged = (text) => {
  return {
    type: EMAIL_CHANGED,
    payload: text
  };
};

export const passwordChanged = (text) => {
  return {
    type: PASSWORD_CHANGED,
    payload: text
  };
};


export const loginUser = ({ email, password }) => {
  const encryptedPassword = md5(password).toString();

  var body = {"username": email, "password": encryptedPassword, "type": "opac"}

  const serializeBody = encodeURIComponent(JSON.stringify(body));

  let myApiUrl = `http://vlib-qax-5-1.vivox.com/grr.php?service=open-ils.auth&method=open-ils.auth.authenticate.init&param=${serializeBody}`;

  console.log("myApiUrl", myApiUrl);

  return (dispatch) => {
    dispatch({ type: LOGIN_USER });
    return fetch(myApiUrl)
    .then(user => loginUserSuccess(dispatch, user))
    .catch(() => {
      loginUserFail(dispatch)
    });
  };
};

const loginUserFail = (dispatch) => {
  dispatch({ type: LOGIN_USER_FAIL });
};

const loginUserSuccess = (dispatch, user) => {
  dispatch({
    type: LOGIN_USER_SUCCESS,
    payload: user
  });
  Actions.main();
};
