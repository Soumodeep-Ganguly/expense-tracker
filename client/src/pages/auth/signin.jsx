import React, { useState, useContext, useEffect } from 'react'
import Text from '../../component/inputs/text'
import Button from '../../component/button'
import { AuthContext } from '../../app/auth'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Toast from '../../component/toast'
import './signin.scss'

export default function SignIn() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const authContext = useContext(AuthContext)

    useEffect(() => {
        if(authContext.user) window.location = "/"
    }, [authContext.user])

    const signInUser = async () => {
        if(email.trim() === "") return Toast.fire({ icon: 'error', title: "Email required" })
        if(password === "") return Toast.fire({ icon: 'error', title: "Password required" })

        try {
            let res = await axios.post('/api/auth/signin', { email, password })
            authContext.signin(res)
        } catch (error) {
            Toast.fire({ icon: 'error', title: error?.response?.data?.error || "Unable to Sign-In" })
        }
    }

    return (
        <div className='sign-in-container'>
            <div>
                <h1>Welcome Back!</h1>
                <p>Login to continue</p>
                <Text 
                    label="Email Address"
                    value={email}
                    onChange={setEmail}
                    variant="primary"
                    type="email"
                    style={{ marginTop: 50 }}
                />
                <Text 
                    type={"password"}
                    value={password}
                    onChange={setPassword}
                    label={"Password"}
                    variant="primary"
                    style={{ marginTop: 30, marginBottom: 20 }}
                />
                <Link to="/forgot-password" style={{ fontSize: 14 }}>Forgot Password</Link>
                <Button 
                    variant="dark"
                    text="Login"
                    onClick={() => signInUser()}
                    style={{ marginTop: 30, marginBottom: 90 }}
                />

                <Link to="/signup">CREATE ACCOUNT</Link>
            </div>
        </div>
    )
}
