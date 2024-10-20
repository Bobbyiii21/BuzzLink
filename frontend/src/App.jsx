import { useState } from 'react'
import './App.css'
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom';


function App({routes}) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  // create a function to handle the form submission
  const handleSubmit = (e) => {
    //do not reload the page
    e.preventDefault();
    //send information to console
    console.log("User:", email , "\nPassword:", password);
    //alert the user using dialog box
    window.alert(`User: ${email} \nPassword: ${password}`);

    //can access the user's input for email and password here, connect to backend?

    // find a way to redirect to either the homepage (if login information is correct) or add/unhide incorrect login message (if login information is incorrect)
    window.location.href = "";

  }




  return (

    //login page

    <div className = 'bgDeco'>
      <div className = 'mainContainer'>
          <div className= 'logo'>BuzzLink</div>
          <br/>
          <form className = 'logInForm' action={handleSubmit}>
              <input type='email' className = 'field' name = 'email' placeholder = "Email" onInput={(e) => setEmail(e.currentTarget.value)}></input>
            <br/>
              <input type='password' className = 'field' name = 'password' placeholder = "Password" onInput={(e) => setPassword(e.currentTarget.value)}></input>
            <br/> <br/>
              <button className='submitButton' type="submit">Log In</button>
        </form>
        <br/>
        <a href= "<Forgot/>" className='forgotPassword'>Forgot Password?</a>
        <br/>
        <div className='orDivider'>—————<div className='smallSizeOr'> OR </div>—————</div>
        <br/>
        <div className='createAccount'>Create Account</div>
      </div>
    </div >



  
  )

}

export default App
