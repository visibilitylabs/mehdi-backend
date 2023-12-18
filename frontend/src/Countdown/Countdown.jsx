import React, {useState, useEffect} from 'react';
import '../Countdown.css';
import { Button } from '@mui/material';
import dayjs from 'dayjs';
import * as api from '../api/index.js';
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
    const [id, setId]=useState('');

    useEffect(()=>{
        const urlParams=new URLSearchParams(window.location.search);
        const id=urlParams.get('id');
        if(id)
        {
            api.setToken();
            dispatch(setLoading(true));
            api.getCountdown(id).then((res)=>{
                setTitle(res.data.title);
                setTimeString(res.data.date);
                setTime(dayjs(res.data.date));
                setId(res.data._id);
                setBackgroundImage(res.data.backgroundImage);
            dispatch(setLoading(false));
            }).catch((err)=>{
                console.log(err);
            dispatch(setLoading(false));

            })
        }
    }, [])

    useEffect(()=>{
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

    const [timeInterval, setTimeInterval]=useState(null);
    useEffect(()=>{

        if(time)
        {
            const interval=setInterval(()=>{
                if(interval!=timeInterval)
                {
                    clearInterval(timeInterval);
                }
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

    const onClickShare=()=>{
        const currentUrl=window.location.href;
        navigator.clipboard.writeText(currentUrl);
        dispatch(openSnackBar('Link copied to clipboard', 'info'));
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
        <div className="countdown-main-content">
            <div className="countdown-first-part">
                <div className="countdown-title">
                    {title}
                </div>
                <div className={"countdown-timer-container"}>
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
                   
                </div>
            </div>
            <div className="countdown-second-part">
                <div className="want-to-share-text">
                    Want to share this Countdown?
                </div>
                <div className="countdown-share-button-container">
                    <Button onClick={()=>onClickShare()} variant="contained" color="primary" disableElevation className="countdown-share-button">
                    <svg width="18" height="16" viewBox="0 0 18 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<g clip-path="url(#clip0_18_52)">
<path d="M11 7H9.54688C8.14062 7 7 8.14062 7 9.54688C7 10.2437 7.32188 10.6187 7.6 10.8125C7.8125 10.9594 8 11.1875 8 11.4469C8 11.7531 7.75 12.0031 7.44375 12.0031H7.36562C7.29063 12.0031 7.21563 11.9906 7.14375 11.9594C6.5875 11.7125 4 10.4187 4 7.5C4 5.01562 6.01562 3 8.5 3H11V1.08438C11 0.484375 11.4844 0 12.0844 0C12.3531 0 12.6094 0.1 12.8094 0.278125L17.1281 4.16563C17.3656 4.37813 17.5 4.68125 17.5 5C17.5 5.31875 17.3656 5.62187 17.1281 5.83437L12.7844 9.74375C12.6 9.90937 12.3625 10 12.1156 10H12C11.4469 10 11 9.55313 11 9V7ZM2.5 3C2.225 3 2 3.225 2 3.5V13.5C2 13.775 2.225 14 2.5 14H12.5C12.775 14 13 13.775 13 13.5V12C13 11.4469 13.4469 11 14 11C14.5531 11 15 11.4469 15 12V13.5C15 14.8813 13.8813 16 12.5 16H2.5C1.11875 16 0 14.8813 0 13.5V3.5C0 2.11875 1.11875 1 2.5 1H4C4.55312 1 5 1.44687 5 2C5 2.55312 4.55312 3 4 3H2.5Z" fill="#1E3050"/>
</g>
<defs>
<clipPath id="clip0_18_52">
<rect width="18" height="16" fill="white"/>
</clipPath>
</defs>
</svg>
 Share
                    </Button>
                </div>
            </div>
        </div>
    </div>
  )
}
