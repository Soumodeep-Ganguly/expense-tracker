import React, { useState, useContext, useEffect } from 'react'
import Text from '../../component/inputs/text'
import Button from '../../component/button'
import { AuthContext } from '../../app/auth'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Toast from '../../component/toast'
import './signup.scss'

export default function SignUp() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const authContext = useContext(AuthContext)

    useEffect(() => {
        if(authContext.user) window.location = "/"
    }, [authContext.user])

    const signUpUser = async () => {
        if(name.trim() === "") return Toast.fire({ icon: 'error', title: "Name required" })
        if(email.trim() === "") return Toast.fire({ icon: 'error', title: "Email required" })
        if(password === "") return Toast.fire({ icon: 'error', title: "Password required" })

        try {
            let res = await axios.post('/api/auth', { name, email, password })
            authContext.signin(res)
        } catch (error) {
            Toast.fire({ icon: 'error', title: error?.response?.data?.error || "Unable to Sign-Up" })
        }
    }

    return (
        <div className='sign-up-container'>
            <div>
                <h1>Create Account</h1>
                <Text 
                    value={name}
                    onChange={setName}
                    label={"Full Name"}
                    variant="dark"
                    style={{ marginTop: 50 }}
                />
                <Text 
                    value={email}
                    onChange={setEmail}
                    label={"Email Address"}
                    variant="dark"
                    type="email"
                    style={{ marginTop: 30 }}
                />
                <Text 
                    type={"password"}
                    value={password}
                    onChange={setPassword}
                    label={"Password"}
                    variant="dark"
                    style={{ marginTop: 30 }}
                />
                <Button 
                    variant="primary"
                    text="Create"
                    onClick={() => signUpUser()}
                    style={{ marginTop: 30, marginBottom: 90 }}
                />

                <Link to="/signin">LOGIN</Link>
            </div>
        </div>
    )
}