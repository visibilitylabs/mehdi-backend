import { TextField, Button } from '@mui/material';
import React, {useState, useEffect} from 'react'
import { useDispatch, useSelector } from 'react-redux';
import {  useNavigate } from 'react-router-dom';
import {signUp} from '../../redux/user/userActions';

function SignupCard() {
  const userToken=useSelector(state=>state.user.token);
    const [user, setUser]=useState({
      name:'',
        email:'',
        password:'',
      })
      
      const dispatch=useDispatch();
      const navigation=useNavigate();
      const handleSubmit=()=>{
        dispatch(signUp(user, useNavigate));
        console.log(user);
      }
      const handleChange=(e)=>{setUser({...user,[e.target.name]:e.target.value})}
      useEffect(()=>{
        if(userToken!=='')
        navigation('/dashboard')
      }, [userToken])
    return (
    <>
        <div className='card-header'>
          <div className='heading'>
          <h4>Sign Up</h4>
          </div>
        </div>
        <div className='card-body'>
        <div className='form-group' >
      <TextField label="Name" className='' name='name' value={user.name} onChange={handleChange} ></TextField>
          </div><div className='form-group' >
      <TextField label="Email" className='' name='email' value={user.email} onChange={handleChange} ></TextField>
          </div>
          <div className='form-group' >
      <TextField label="Password" className='' name='password' type='password' value={user.password} onChange={handleChange}></TextField>
          </div>
          {/* <div className='form-group' >
      <TextField label="Confirm Password" className='' name='confirmPassword' type='password' value={user.confirmPassword} onChange={handleChange}></TextField>
          </div> */}
        </div>
        <div className="dont-have-account">
          Already have an acount? <a href="#" onClick={(e)=>{
            e.preventDefault();
            navigation('/login')
          }} >Login</a>
        </div>
          <div className='card-footer'>
            <Button variant='contained' color='primary' disableElevation className='button button-primary' type='button' style={{flex:1, padding:'10px', background:'black'}} onClick={handleSubmit}>Sign Up</Button>
          </div>
      </>
)}

export default SignupCard;