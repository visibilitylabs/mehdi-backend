import axios from 'axios';
import * as api from '../../api';
import { LOGIN, LOGOUT } from './userTypes';

export const login = (user, navigation) => async(dispatch) => {
    try {
        const { data } = await api.login(user);
        console.log(data)
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token);
        dispatch({ type: LOGIN, payload: {...data.user, token: data.token } });
        // console.log(data);
        return true;
    } catch (error) {
        console.log({ error }, error.message);
        dispatch({ type: 'OPEN_SNACKBAR', payload: { snackBarMessage: error.response.data.error, snackBarSeverity: 'error' } });
    }
}

export const signUp = (user, navigation) => async(dispatch) => {
    try {
        const { data } = await api.signUp(user);
        axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        localStorage.setItem('user', JSON.stringify(data.user))
        localStorage.setItem('token', data.token);
        dispatch({ type: LOGIN, payload: {...data.user, token: data.token } });
        return true;
    } catch (error) {
        dispatch({ type: 'OPEN_SNACKBAR', payload: { snackBarMessage: error.response.data.error, snackBarSeverity: 'error' } });
        console.log(error.message);
    }
}

export const logout = () => async(dispatch) => {
    try {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        dispatch({ type: LOGOUT });
    } catch (error) {
        console.log(error)
    }
}

export const setLoading = (loading) => async(dispatch) => {
    try {
        dispatch({ type: 'LOADING', payload: loading });
    } catch (error) {
        console.log(error)
    }
}

export const openSnackBar = (message, severity = 'info') => async(dispatch) => {
    try {
        dispatch({ type: 'OPEN_SNACKBAR', payload: { snackBarMessage: message, snackBarSeverity: severity } })
    } catch (error) {
        console.log(error)
    }
}