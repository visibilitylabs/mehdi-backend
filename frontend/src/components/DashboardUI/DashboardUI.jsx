import React, {useState, useEffect} from 'react'
import './DashboardUI.css'
import {Button, ButtonGroup } from '@mui/material'
import { useDispatch, useSelector } from 'react-redux';
import { logout, openSnackBar, setLoading } from '../../redux/user/userActions';
import { useNavigate } from 'react-router-dom';
import * as api from '../../api/index.js';

export default function DashboardUI() {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const navigation=useNavigate();
    const [currentTime, setTime]=useState(new Date());
    useEffect(()=>{
        const Timer=setInterval(()=>{setTime(new Date());}, 1000);
        return ()=>{clearInterval(Timer);}
    })
    const currentTimeObj={
        hour:currentTime.getHours(),
        minutes:currentTime.getMinutes(),
        day:currentTime.getDay()
    }
    const dispatch=useDispatch();
    const handleLogout=()=>{
        dispatch(logout()); 
        dispatch(openSnackBar('You have been logged out.', 'info'));
        navigation('/login');
    }

    const user=useSelector(state=>state.user);

    const [countdownList, setCountdownList]=useState([]);
    const [countdownListModified, setCountdownListModified]=useState([]);
    const [countdownPageLimit, setCountdownPageLimit]=useState(false);
    const pageSize=10;
    const [page, setPage]=useState(1);
    useEffect(()=>{
        if(!user.token)
        {
            return;
        }
        dispatch(setLoading(true));  
        api.getCountdowns(page, pageSize).then((res)=>{
            console.log(res);
            setCountdownList(res.data.list);
            if(res.data.list.length<pageSize||page*pageSize>=res.data.count)
            {
                setCountdownPageLimit(true);
                console.log('page limit reached', res.data.list.length)
            }
            setListLength(res.data.count);
            dispatch(setLoading(false));
        }).catch((err)=>{
            dispatch(setLoading(false));
            dispatch(openSnackBar('Error fetching countdowns', 'error'));
            console.log(err);
        })
    }, [page, user.token])

    useEffect(()=>{
        setCountdownListModified(countdownList.map((countdown)=>{
            const currentTime=new Date();
            const countdownTime=new Date(countdown.date);
            const isActive=countdownTime.getTime()>currentTime.getTime();
            return {...countdown, isActive:isActive, date:new Date(countdown.date).toLocaleString(), createdAt:new Date(countdown.createdAt).toLocaleString()};
            }));
    }, [countdownList, page])

    const [pageLowerLimit, setPageLowerLimit]=useState(1);
    const [pageUpperLimit, setPageUpperLimit]=useState(pageSize);
    useEffect(()=>{
        setPageLowerLimit((page-1)*pageSize+1);
        setPageUpperLimit(page*pageSize - (countdownList.length<pageSize?pageSize-countdownList.length:0));
    }, [page, countdownList]);

    const [listLength, setListLength]=useState(0);

    const handlePageChange=(val)=>{
        if(val===-1)
        {
            if(page>1)
            setPage(page-1);
        }
        else if(val===1)
        {
            if(!countdownPageLimit)
            setPage(page+1);
        }
    };

    const onClickShare=(id)=>{
        const currentUrl=window.location.href;
        console.log(currentUrl);
        let url=currentUrl;
        // include only root url
        url=url.split('/').slice(0, 3).join('/');
        url+=`/countdown?id=${id}`;
        console.log(url);
        
        navigator.clipboard.writeText(url);
        dispatch(openSnackBar('Link copied to clipboard', 'info'));
    }

    const navigateToCountdown=(id)=>{
        navigation(`/countdown?id=${id}`);
    }

    const navigateToCreateCountdown=()=>{
        navigation('/countdown/create');
    }

    const onClickEdit=(id)=>{
        navigation(`/countdown/edit?id=${id}`);
    }

    const onClickDelete=(id)=>{ 
        dispatch(setLoading(true));
        api.deleteCountdown(id).then((res)=>{
            console.log(res);
            dispatch(setLoading(false));
            dispatch(openSnackBar('Countdown deleted successfully', 'success'));
            setCountdownListModified(countdownListModified.filter((countdown)=>countdown._id!==id));
        }).catch((err)=>{
            dispatch(setLoading(false));
            dispatch(openSnackBar('Error deleting countdown', 'error'));
            console.log(err);
        })
    }

  return (
    <div className='dashboard-wrapper' >
        <div className="dashboard-header">
            <div className="dashboard-title-container">
                <div className="dashboard-title">Dashboard</div>
                <div className="dashboard-date">
                {(currentTimeObj.hour>12?currentTimeObj.hour%12:currentTimeObj.hour)}:{currentTimeObj.minutes<10?'0'+currentTimeObj.minutes:currentTimeObj.minutes} {currentTimeObj.hour>=12?'PM':'AM'}, {days[currentTimeObj.day]}
                </div>
            </div>
            <div className="dashboard-user-details">
                <ButtonGroup aria-label="outlined primary button group">
                    <Button  variant="outlined" disableElevation className='button-group-button'>
                {user.name}
                    </Button>
                    <Button onClick={()=>{handleLogout()}}  variant="outlined" disableElevation className='button-group-button' >
                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path fill="#000000" d="M502.6 278.6c12.5-12.5 12.5-32.8 0-45.3l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 224 192 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l210.7 0-73.4 73.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0l128-128zM160 96c17.7 0 32-14.3 32-32s-14.3-32-32-32L96 32C43 32 0 75 0 128L0 384c0 53 43 96 96 96l64 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-64 0c-17.7 0-32-14.3-32-32l0-256c0-17.7 14.3-32 32-32l64 0z"/></svg>
                    </Button>
                </ButtonGroup>
            </div>
        </div>
        <div className="dashboard-card-container">
            <div className="dashboard-card">
                <div className="dashboard-card-header">
                    <div className="dashboard-card-title">
                        Countdowns
                    </div>
                    <div className="dashboard-card-action-button">
                       <Button onClick={()=>{navigateToCreateCountdown()}} variant="contained" color="primary" disableElevation className='button button-primary' >
                        + Create
                        </Button>
                    </div>
                </div>
                <div className="dashboard-card-body">
                   {countdownListModified.length>0&&<table className="dashboard-card-table">
                        <thead>
                            <th>Name</th>
                            <th>Time</th>
                            <th>Created on</th>
                            <th className='status-indicator-header' >Status</th>
                            <th>&nbsp;</th>
                        </thead>
                        <tbody>
                            {/* <tr>
                                <td>Event 1</td>
                                <td>12th December 2023</td>
                                <td>12th December 2023</td>
                                <td className='status-indicator active' ><div>Active</div></td>
                                <td>
                                    <Button variant="outlined" color="secondary" disableElevation className='button button-primary' >
                                    Share
                                    </Button>
                                    <Button variant="" color="secondary" disableElevation className='button button-primary' >
                                    <svg xmlns="http://www.w3.org/2000/svg" height="16" width="4" viewBox="0 0 128 512">
                                        <path fill="#000000" d="M64 360a56 56 0 1 0 0 112 56 56 0 1 0 0-112zm0-160a56 56 0 1 0 0 112 56 56 0 1 0 0-112zM120 96A56 56 0 1 0 8 96a56 56 0 1 0 112 0z"/></svg>
                                    </Button>
                                </td>
                            </tr> */}
                            {
                                countdownListModified.map((countdown)=>{
                                    return (
                                        <tr onClick={()=>{
                                            navigateToCountdown(countdown._id);
                                        }} >
                                            <td>{countdown.title}</td>
                                            <td>{countdown.date}</td>
                                            <td>{countdown.createdAt}</td>
                                            <td className={countdown.isActive?'status-indicator active':'status-indicator '} ><div>{countdown.isActive?'Active':'Inactive'}</div></td>
                                            <td className='share-actions' >
                                                <ButtonGroup>
                                                <Button onClick={(e)=>{
                                                    e.stopPropagation();
                                                    onClickShare(countdown._id);
                                                }} variant="outlined"  disableElevation className=' button-group-button' title="Share" >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="18" viewBox="0 0 576 512"><path fill="#000000" d="M352 224H305.5c-45 0-81.5 36.5-81.5 81.5c0 22.3 10.3 34.3 19.2 40.5c6.8 4.7 12.8 12 12.8 20.3c0 9.8-8 17.8-17.8 17.8h-2.5c-2.4 0-4.8-.4-7.1-1.4C210.8 374.8 128 333.4 128 240c0-79.5 64.5-144 144-144h80V34.7C352 15.5 367.5 0 386.7 0c8.6 0 16.8 3.2 23.2 8.9L548.1 133.3c7.6 6.8 11.9 16.5 11.9 26.7s-4.3 19.9-11.9 26.7l-139 125.1c-5.9 5.3-13.5 8.2-21.4 8.2H384c-17.7 0-32-14.3-32-32V224zM80 96c-8.8 0-16 7.2-16 16V432c0 8.8 7.2 16 16 16H400c8.8 0 16-7.2 16-16V384c0-17.7 14.3-32 32-32s32 14.3 32 32v48c0 44.2-35.8 80-80 80H80c-44.2 0-80-35.8-80-80V112C0 67.8 35.8 32 80 32h48c17.7 0 32 14.3 32 32s-14.3 32-32 32H80z"/></svg>
                                                </Button>
                                                <Button onClick={(e)=>{
                                                    e.stopPropagation();
                                                    onClickEdit(countdown._id);
                                                }} variant="outlined"  disableElevation className='button-group-button' >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"><path fill="#000000" d="M471.6 21.7c-21.9-21.9-57.3-21.9-79.2 0L362.3 51.7l97.9 97.9 30.1-30.1c21.9-21.9 21.9-57.3 0-79.2L471.6 21.7zm-299.2 220c-6.1 6.1-10.8 13.6-13.5 21.9l-29.6 88.8c-2.9 8.6-.6 18.1 5.8 24.6s15.9 8.7 24.6 5.8l88.8-29.6c8.2-2.7 15.7-7.4 21.9-13.5L437.7 172.3 339.7 74.3 172.4 241.7zM96 64C43 64 0 107 0 160V416c0 53 43 96 96 96H352c53 0 96-43 96-96V320c0-17.7-14.3-32-32-32s-32 14.3-32 32v96c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V160c0-17.7 14.3-32 32-32h96c17.7 0 32-14.3 32-32s-14.3-32-32-32H96z"/></svg>
                                                </Button>
                                                <Button onClick={(e)=>{
                                                    e.stopPropagation();
                                                    onClickDelete(countdown._id);
                                                }} variant="outlined"  disableElevation className='button-group-button' >
                                                <svg xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"><path fill="#000000" d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                                                </Button>
                                                </ButtonGroup>
                                                
                                            </td>
                                        </tr>
                                    )
                                })
                            }
                        </tbody>
                    </table>}
                    {countdownListModified==0&&<div className='empty-list-message'>
                        <div>
                        There are no countdowns to show.<br></br> Create countdowns by clicking on the create button above.
                        </div>
                    </div>}
                </div>
                <div className="dashboard-card-footer">
                    <div className="dashboard-entries-text">
                        Showing {pageLowerLimit} to {pageUpperLimit} of {listLength} entries
                    </div>
                    <div className="dashboard-pagination">
                        <div className="dashboard-pagination-button" onClick={()=>{handlePageChange(-1)}} >
                            Previous
                        </div>
                        <div className="dashboard-pagination-button page-number-button">
                            {page}
                        </div>
                        <div className="dashboard-pagination-button"  onClick={()=>{handlePageChange(1)}}>
                            Next
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  )
}
