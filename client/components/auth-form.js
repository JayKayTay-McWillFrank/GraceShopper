import React from 'react'
import {connect} from 'react-redux'
import {authenticate} from '../store'
import Button from '@material-ui/core/Button'
import { setSingleUser } from '../store/singleUser'
import GoogleLogin from 'react-google-login'

const handleLogin = (res)=>{
  alert("Login Successful")
}
const handleLoginFail = (res)=>{
  alert("Login Failed")
}

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error} = props

  return (
    <div>
      <form onSubmit={handleSubmit} name={name} className='container'>
        {name === 'signup' ? (
          <div className='close-buttons'>
            <label htmlFor="userName">
              <small>Name</small>
            </label>
            <input name="userName" type="text" />
          </div>
        ) : (
          ''
        )}
        <div className='close-buttons'>
          <label htmlFor="email">
            <small>Email</small>
          </label>
          <input name="email" type="text" />
        </div>
        <div className='close-buttons'>
          <label htmlFor="password">
            <small>Password</small>
          </label>
          <input name="password" type="password" />
        </div>
        <div className='close-buttons'>
          <Button type="submit">{displayName}</Button>
          {/* {
            name==='login'? (
          <GoogleLogin
            clientId={"1082203464140-aj577c1s7hd66eop9ggbim5ib7dpe2kt.apps.googleusercontent.com"}
            buttonText="Login"
            onSuccess={handleLogin('success')}
            onFailure={handleLoginFail('fail')}
            cookiePolicy={'single_host_origin'}
            style={{height: '1rem'}}
            isSignedIn={true}
        />
        )
        :
        ''
        } */}
        </div>
        {error && error.response && <div> {error.response.data} </div>}
      </form>
      {
        window.githubURL && <a href={window.githubURL}>Login / Register Via Github </a>
      }
    </div>
  )
}


/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Login',
    error: state.auth.error
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.auth.error
  }
}


const mapDispatch = dispatch => {
  return {
    handleSubmit(evt) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      const name = evt.target.userName ? evt.target.userName.value : '';
      window.localStorage.setItem('userEmail', email)
      dispatch(authenticate(name, email, password, formName));
      dispatch(setSingleUser(email));
    },
    GoogleLogin() {

    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(AuthForm)
export const Signup = connect(mapSignup, mapDispatch)(AuthForm)
