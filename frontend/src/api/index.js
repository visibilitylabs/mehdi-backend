import axios from 'axios';

const url = '/api';

export const login = user => axios.post(url + '/user/login', {...user });
export const signUp = user => axios.post(url + '/user/signup', {...user });

export const getCountdowns = (page, pageSize) =>
    axios.get(url + '/countdowns', { params: { page, pageSize } });

export const getCountdown = id => axios.get(url + '/countdowns/' + id);

export const addCountdown = countdown =>
    axios.post(url + '/countdowns', {...countdown });

export const updateCountdown = (id, countdown) =>
    axios.put(url + '/countdowns/' + id, {...countdown });

export const deleteCountdown = id => axios.delete(url + '/countdowns/' + id);

export const setToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
};