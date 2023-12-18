import React, {useEffect, useRef, useState} from 'react';
import '../Countdown.css';
import { Button, ButtonGroup } from '@mui/material';
import { LocalizationProvider, MobileDateTimePicker, StaticDateTimePicker } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import us from 'date-fns/locale/en-US';
import * as api from '../api/index.js';
import { useNavigate } from 'react-router-dom';
import { openSnackBar, setLoading } from '../redux/user/userActions.js';
import { useDispatch } from 'react-redux';

export default function Countdown() {

    const [title, setTitle]=useState('');
    const [time, setTime]=useState('');
    const [timeString, setTimeString]=useState('');
    const [timeObj, setTimeObj]=useState({
        days:0,
        hours:0,
        minutes:0,
        seconds:0
    });
    const dispatch=useDispatch();

    const [editMode, setEditMode]=useState(false);
    const [editId, setEditId]=useState('');


    useEffect(()=>{
        // check if timestring has all the required fields
        if(timeString)
        {
            // check if timestring is less than current time
            if(dayjs(timeString).isBefore(dayjs()))
            {
                setTimeString('');
                setTime(null);
                setTimeObj({
                    days:0,
                    hours:0,
                    minutes:0,
                    seconds:0
                });
            }

            const timeObj=dayjs(timeString);
            if(timeObj.isValid())
            {
                setTime(timeObj);
            }
        }
    }, [timeString])


    // useEffect(()=>{
    //     if(time)
    //     {
    //         const timeObj={
    //             days:dayjs(time).diff(dayjs(), 'day'),
    //             hours:dayjs(time).diff(dayjs(), 'hour')%24,
    //             minutes:dayjs(time).diff(dayjs(), 'minute')%60,
    //             seconds:dayjs(time).diff(dayjs(), 'second')%60
    //         }
    //         setTimeObj(timeObj);
    //     }
    // }, [time])
    const [timeInterval, setTimeInterval]=useState(null);
    useEffect(()=>{

        if(time)
        {
            const interval=setInterval(()=>{
                if(interval!=timeInterval)
                {
                    clearInterval(timeInterval);
                }
                // check if time is less than current time
                if(dayjs(time).isBefore(dayjs()))
                {
                    setTimeString('');
                    setTime(null);
                    setTimeObj({
                        days:0,
                        hours:0,
                        minutes:0,
                        seconds:0
                    });
                    clearInterval(interval);
                    return;
                }
                const timeObj={
                    days:dayjs(time).diff(dayjs(), 'day'),
                    hours:dayjs(time).diff(dayjs(), 'hour')%24,
                    minutes:dayjs(time).diff(dayjs(), 'minute')%60,
                    seconds:dayjs(time).diff(dayjs(), 'second')%60
                }
                setTimeObj(timeObj);
            }, 1000);
            setTimeInterval(interval);
        };
        
        return ()=>{console.log('clearing interval');clearInterval(timeInterval);}
    }, [time])

    const [backgroundImage, setBackgroundImage]=useState(null);

    const onSubmitFileForImageUpload=(e)=>{
        e.preventDefault();
        // get the file data as base64 image string
        const reader=new FileReader();
        reader.readAsDataURL(e.target.files[0]);
        reader.onloadend=()=>{
            setBackgroundImage(reader.result);
        }
    }
    const fileInputRef=useRef(null);

    useEffect(()=>{
        let image=backgroundImage;
        if(image)
        {
            const img=new Image();
            img.src=image;
            img.onload=()=>{
                const canvas=document.createElement('canvas');
                canvas.width=img.width;
                canvas.height=img.height;
                const ctx=canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                const imageData=ctx.getImageData(0, 0, canvas.width, canvas.height);
                const data=imageData.data;
                let r=0, g=0, b=0, count=0;
                for(let i=0;i<data.length;i+=4)
                {
                    r+=data[i];
                    g+=data[i+1];
                    b+=data[i+2];
                    count++;
                }
                r=Math.floor(r/count);
                g=Math.floor(g/count);
                b=Math.floor(b/count);
                const brightness=(r*299+g*587+b*114)/1000;
                if(brightness<128)
                {
                    console.log('dark')
                    document.documentElement.style.setProperty('--countdown-text-color', 'white');
                    document.documentElement.style.setProperty('--countdown-background-elements', 'white');
                }
                else
                {
                    console.log('light')
                    document.documentElement.style.setProperty('--countdown-text-color', 'black');
                    document.documentElement.style.setProperty('--countdown-background-elements', '#c1c1c1');
                }
            }
        }
        else
        {
            document.documentElement.style.setProperty('--countdown-text-color', 'black');
            document.documentElement.style.setProperty('--countdown-background-elements', '#c1c1c1');
        }
    }
    , [backgroundImage])
const navigation=useNavigate();
    useEffect(()=>{
        const urlParams=new URLSearchParams(window.location.search);
        const id=urlParams.get('id');
        if(id)
        {
            api.setToken();
            dispatch(setLoading(true));
            api.getCountdown(id).then((res)=>{
                console.log(res);
                const countdown=res.data;
                setTitle(countdown.title);
                setTime(countdown.date);
                setBackgroundImage(countdown.backgroundImage);
                setEditId(id);
                setEditMode(true);
            dispatch(setLoading(false));
                
            }).catch((err)=>{
                console.log(err);
            dispatch(setLoading(false));

            })
        }
    }, [])

    const onClickCreate=()=>{
        if(!time || !title)
        {
            alert('Please fill all the fields');
            return;
        }
        const countdown={
            title:title,
            date:time,
            backgroundImage:backgroundImage
        }
        dispatch(setLoading(true));
        api.addCountdown(countdown).then((res)=>{
            console.log(res);
            let id=res.data._id;
            dispatch(setLoading(false));
            dispatch(openSnackBar('Countdown Created Successfully', 'success'));;
            navigation(`/countdown/?id=${id}`, {replace:true});
        }).catch((err)=>{
            console.log(err);
            dispatch(setLoading(false));
            dispatch(openSnackBar('Error Creating Countdown', 'error'));
        })
    }

    const onClickEdit=()=>{
        if(!time || !title)
        {
            alert('Please fill all the fields');
            return;
        }
        const countdown={
            title:title,
            date:time,
            backgroundImage:backgroundImage
        }
        dispatch(setLoading(true));
        api.updateCountdown(editId, countdown).then((res)=>{
            console.log(res);
            let id=res.data._id;
            dispatch(setLoading(false));
            dispatch(openSnackBar('Countdown Updated Successfully', 'success'));;
            navigation(`/countdown/?id=${id}`, {replace:true});
        }).catch((err)=>{
            console.log(err);
            dispatch(setLoading(false));
            dispatch(openSnackBar('Error Updating Countdown', 'error'));
        })
    }

  return (
    <div className="countdown-wrapper" style={
        backgroundImage?{
            backgroundImage:`url(${backgroundImage})`,
            backgroundSize:'cover',
            backgroundPosition:'center'
        }:{}
    } >
        <div className="countdown-project-title">
            Countdown Project
        </div>
        <div className="edit-background-button">
    <ButtonGroup>

            <Button variant="outlined" onClick={()=>{
                fileInputRef.current.click();
            }}  disableElevation className="edit-background-button">
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512">
                <path fill="#000000" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
            Background 
            </Button>
            {backgroundImage&&<Button variant="outlined" onClick={
                ()=>{
                    setBackgroundImage(null);
                }
            }
            >
                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"><path fill="#000000" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
            </Button>}
                </ButtonGroup>
            <input id='file-input' name='file-input' ref={fileInputRef} style={{
                display:'none'
            }}  type="file" accept="image/*" onChange={onSubmitFileForImageUpload} ></input>
        </div>
        <div className="countdown-main-content">
            <div className="countdown-first-part first-part-edit">
                <div className="countdown-title">
                    <input value={title} className={title?'':'show-border'} placeholder='Set Title' onChange={(e)=>{setTitle(e.target.value)}} ></input>
                </div>
                <div className={time?"countdown-timer-container":"countdown-timer-container show-hoverable"}>
                    <div className="countdown-timer">
                        <div className="countdown-timer-element countdown-timer-days">
                            <div className="countdown-timer-value">
                            {timeObj.days<10?'0':''}{timeObj.days}
                            </div>
                            <div className="countdown-timer-label">
                                Days
                            </div>
                        </div>
                        <div className="countdown-timer-element countdown-timer-hours">
                            <div className="countdown-timer-value">
                            {timeObj.hours<10?'0':''}{timeObj.hours}
                            </div>
                            <div className="countdown-timer-label">
                                Hours
                            </div>
                        </div>
                        <div className="countdown-timer-element countdown-timer-minutes">
                            <div className="countdown-timer-value">
                            {timeObj.minutes<10?'0':''}{timeObj.minutes}
                            </div>
                            <div className="countdown-timer-label">
                                Minutes
                            </div>
                        </div>
                        <div className="countdown-timer-element countdown-timer-seconds">
                            <div className="countdown-timer-value">
                            {timeObj.seconds<10?'0':''}{timeObj.seconds}
                            </div>
                            <div className="countdown-timer-label">
                                Seconds
                            </div>
                        </div>
                    </div>
                    <div className="countdown-hoverable">
                        <div className="countdown-hoverable-text">
                            {/* <Button variant="contained" color="primary" disableElevation className="countdown-hoverable-button">
                            {`${time?'Edit':'Set'} Date`}
                            </Button> */}
                            <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={us} >
                            <MobileDateTimePicker label="Set Date" value={timeString?timeString:null} onAccept={(newValue)=>{console.log(newValue); setTimeString(newValue)}}  ></MobileDateTimePicker>
                            </LocalizationProvider>
                        </div>
                    </div>
                </div>
            </div>
            <div className="countdown-second-part">
                <div className="want-to-share-text">
                    {editMode?'Save your changes by clicking Edit':'All Set? Create your Countdown!'}
                </div>
                <div className="countdown-share-button-container">
                    <Button variant="contained" color="primary" disableElevation className="countdown-share-button" onClick={()=>{editMode?onClickEdit():onClickCreate()}} >
                {editMode?'Edit':' + Create'}
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}
