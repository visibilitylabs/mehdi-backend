import React from 'react'
import {  Outlet } from 'react-router-dom'
import './login.css'

function Login() {
  

  return (<>
    <div className="login-background">
      <div className="login-left-top">
      <svg width="433" height="391" viewBox="0 0 433 391" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M432.7 -5C414.6 70.7 396.5 146.4 354.2 199.5C312 252.6 245.6 283 182.5 311.1C119.4 339.2 59.7 365.1 0 391V-5H432.7Z" fill="#E3F8F8"/>
<path d="M324.5 -5C310.9 51.8 297.3 108.6 265.7 148.4C234 188.2 184.2 211 136.9 232.1C89.6 253.2 44.8 272.6 0 292V-5H324.5Z" fill="#A8E9EB"/>
<path d="M216.3 -5C207.3 32.9 198.2 70.7 177.1 97.2C156 123.8 122.8 139 91.3 153C59.7 167.1 29.9 180.1 0 193V-5H216.3Z" fill="#5DD9DE"/>
<path d="M108.2 -5C103.6 13.9 99.1 32.9 88.6 46.1C78 59.4 61.4 67 45.6 74C29.9 81.1 14.9 87.5 0 94V-5H108.2Z" fill="#00D1D7"/>
</svg>
      </div>
      <div className="login-right-bottom">
      <svg width="393" height="418" viewBox="0 0 393 418" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M0 432.7C28.2 372.6 56.3 312.5 84.8 246.7C113.4 180.9 142.2 109.3 196 67.2C249.8 25.2 328.4 12.6 407 0V432.7H0Z" fill="#E3F8F8"/>
<path d="M101.8 432.7C122.9 387.6 144 342.6 165.4 293.2C186.8 243.8 208.4 190.2 248.7 158.6C289.1 127.1 348 117.6 407 108.2V432.7H101.8Z" fill="#A8E9EB"/>
<path d="M203.5 432.7C217.6 402.7 231.7 372.6 245.9 339.7C260.2 306.8 274.6 271 301.5 250C328.4 228.9 367.7 222.7 407 216.4V432.7H203.5Z" fill="#5DD9DE"/>
<path d="M305.3 432.7C312.3 417.7 319.3 402.7 326.5 386.2C333.6 369.7 340.8 351.9 354.2 341.3C367.7 330.8 387.3 327.7 407 324.5V432.7H305.3Z" fill="#00D1D7"/>
</svg>
</div>
    </div>
    <div className=' login-container'>
      {/* <div className='card' >
      <div className='card-body'>
        <div></div>
      </div>
      </div> */}
   
   <div className='card login-card'>

      <Outlet/>
      </div>
      </div></>
      )
}

export default Login