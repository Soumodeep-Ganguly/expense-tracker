import React, { useEffect, useState } from 'react';
import axios from 'axios'
import Text from '../../component/inputs/text'
import Button from '../../component/button';
import Toast from '../../component/toast'
import './index.scss'

export default function Settings() {
    const [loading, setLoading] = useState(false)
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [yearly, setYearly] = useState(false)

    useEffect(() => {
        fetchUser()
    }, [])

    const fetchUser = async () => {
        try {
            let res = await axios.get('/api/user')
            let data = res.data
            if(data) {
                setName(data.name)
                setEmail(data.email)
                setYearly(data.yearly_view)
            }
        } catch(err) {

        }
    }

    const saveUser = async () => {
        if(name.trim() === "") return Toast.fire({ icon: 'error', title: "Name required." })
        setLoading(true)
        try {
            await axios.put('/api/user', { name, yearly })
            Toast.fire({ icon: 'success', title: "User settings updated." })
            setLoading(false)
        } catch(err) {
            setLoading(false)
            Toast.fire({ icon: 'error', title: err.response?.data?.error || `Unable to update user.` })
        }
    }

    return (
        <div className="setting-container">
            <h1 className='page-title'>Settings</h1>
            <div className="user-form">
                <Text 
                    label="Full Name"
                    value={name}
                    onChange={setName}
                    style={{ marginTop: 20 }}
                />
                <Text 
                    label="Email"
                    value={email}
                    onChange={setEmail}
                    disable={true}
                    style={{ marginTop: 30 }}
                />
                <div className='csLabel'>Dashboard Chart View</div>
                <div className='text-switch'>
                    <div className={`off ${!yearly && "active"}`} onClick={() => setYearly(false)}>
                        Monthly
                    </div>
                    <div className={`on ${yearly && "active"}`} onClick={() => setYearly(true)}>
                        Yearly
                    </div>
                </div>
                <Button 
                    text={"Save"}
                    className="save"
                    loading={loading}
                    onClick={() => saveUser()}
                    style={{ marginTop: 30, marginBottom: 20 }}
                />
            </div>
        </div>
    )
}
