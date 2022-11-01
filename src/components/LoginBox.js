import PropTypes from 'prop-types'
import React, { useState } from 'react'

const LoginBox = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginIsLoading, setLoginIsLoading] = useState(false)
    const spinningLoader = require('../images/spinner-cropped.gif')
    const onSubmit = () => {
        if (username == '' || password == '') {
            alert('Please enter both a username and a password')
            return
        }
        setLoginIsLoading(true)
        onLogin(username, password, setLoginIsLoading)
    }
    return (
        <div id="loginBox">
            <div className="loginBoxField">
                <label>Username</label>
                <input type="text" onChange={(e) => setUsername(e.target.value)} onKeyPress={(e) => e.key == 'Enter' ? onSubmit() : ''} />
            </div>
            <div className="loginBoxField">
                <label>Password</label>
                <input type="password" onChange={(e) => setPassword(e.target.value)} onKeyPress={(e) => e.key == 'Enter' ? onSubmit() : ''} />
            </div>
            <button id="loginButton">
                {
                    loginIsLoading
                    ? <img id="spinningLoader" src={spinningLoader} />
                    : <input type="submit" value="Submit" onClick={onSubmit} />
                }
            </button>
        </div>
    )
}

LoginBox.propTypes = {
    onLogin: PropTypes.func
}

export default LoginBox