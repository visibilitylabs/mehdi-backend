import './App.css';
import{ BrowserRouter, Routes, Route, Navigate }from 'react-router-dom'
import Login from './components/Login/Login';
import LoginCard from './components/Login/LoginCard';
import SignUpCard from './components/Login/SignupCard';
import { useEffect,  } from 'react';
import axios from 'axios';
import { useDispatch ,useSelector } from 'react-redux';
import DashboardUI from './components/DashboardUI/DashboardUI';
import CreateCountDown from './CreateCountdown/CreateCountDown';
import Countdown from './Countdown/Countdown';
import { CircularProgress, Snackbar, Alert } from '@mui/material';


function App() {
  const user=useSelector(state=>state.user)
  console.log(user)
  const dispatch=useDispatch();
  const userLocal=JSON.parse(localStorage.getItem('user'));
  const token=localStorage.getItem('token');
  const loading=user.loading;
useEffect(()=>{
  console.log(token)
  if(token)
  {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    dispatch({type:'LOGIN', payload:{...userLocal, token:token}})
  }
},[dispatch]);
const {snackBarOpen, snackBarMessage, snackBarSeverity}=user.snackBarData;
const handleSnackBarClose=()=>{
  dispatch({type:'CLOSE_SNACKBAR'})
}

  return (
    <>
    {loading&&<div className='full-screen-loader'>
      <CircularProgress/>
    </div>}
    <Snackbar anchorOrigin={{vertical:'top', horizontal:'center'}} open={snackBarOpen} autoHideDuration={3000} onClose={handleSnackBarClose} message={snackBarMessage} >
  {/* {snackBarSeverity!='info'&& */}
  <Alert onClose={handleSnackBarClose} sx={{ width: '100%' }} severity={snackBarSeverity} >  
    {snackBarMessage}
  </Alert>
  {/* {snackBarSeverity=='info'&&{snackBarMessage}} */}
</Snackbar>
    <BrowserRouter>
    <Routes>
      <Route  path='login' element={<Login/>}>
        <Route index element={<LoginCard/>}/>
        <Route path='signup' element={<SignUpCard/>}/>
      </Route>
      <Route path='/' element={<Navigate to='/dashboard'/>}  ></Route>
      <Route path='dashboard' element={token?<DashboardUI/>:<Navigate to='/login'/>}>
      </Route>
      <Route path='countdown' element={<Countdown/>}>
      </Route>
      <Route path='countdown/create' element={<CreateCountDown/>}>
      </Route>
      <Route path='countdown/edit' element={<CreateCountDown/>}>
      </Route>
    </Routes>
    </BrowserRouter>
    </>

  );
}

export default App;
