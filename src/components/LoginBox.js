import PropTypes from 'prop-types'
import React, { useState } from 'react'
import SpinningLoader from './SpinningLoader'

const LoginBox = ({ onLogin }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [loginIsLoading, setLoginIsLoading] = useState(false)
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
            <form method="post" onSubmit={(e) => e.preventDefault()}>
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
                        ? <SpinningLoader />
                        : <input type="submit" value="Submit" onClick={onSubmit} />
                    }
                </button>
            </form>
        </div>
    )
}

LoginBox.propTypes = {
    onLogin: PropTypes.func
}

export default LoginBox