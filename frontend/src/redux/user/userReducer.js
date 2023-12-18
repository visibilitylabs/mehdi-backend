import { LOGIN, LOGOUT, } from "./userTypes";
const initialState = {
    name: '',
    email: '',
    token: '',
    countdowns: [],
    snackBarData: { snackBarOpen: false, snackBarMessage: '', snackBarSeverity: 'info' },
    loading: false
}
const userReducer = (state = initialState, action) => {
    switch (action.type) {
        case LOGIN:
            return {...state, ...action.payload };
        case LOGOUT:
            return initialState;
        case 'LOADING':
            return {...state, loading: action.payload };
        case 'OPEN_SNACKBAR':
            return {...state, snackBarData: { snackBarOpen: true, ...action.payload } };
        case 'CLOSE_SNACKBAR':
            return {...state, snackBarData: {...state.snackBarData, snackBarOpen: false } };
        default:
            return state;
    }
}
export default userReducer;