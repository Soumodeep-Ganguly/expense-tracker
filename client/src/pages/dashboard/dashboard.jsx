import React, { useState, useEffect } from 'react'
import axios from 'axios'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import './index.scss'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const options = {
    responsive: true,
    plugins: {
        legend: {
            position: 'bottom',
        }
    },
};

export default function Dashboard() {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [prev, setPrev] = useState(null)
    const [current, setCurrent] = useState(null)

    useEffect(() => {
        fetchExpenses()
    }, [])

    const fetchExpenses = async () => {
        setLoading(true)
        try {
            let res = await axios.get(`/api/expenses-analysis`)
            setData(res.data.chart)
            setPrev(res.data.prevData)
            setCurrent(res.data.thisData)
            setLoading(false)
        } catch(err) {
            // setLoading(false)
        }
    }

    return (
        <div className='dashboard-container'>
            <h1 className='page-title'>Dashboard</h1>
            {!loading && <div className='data-container'>
                <div className='chart-view'>
                    <Line options={options} data={data} />
                </div>
                <div className='amount-view'>
                    <div>
                        <h4>{prev?.label}</h4>
                        <h2>{prev?.value}</h2>
                        <small>(in Rupees)</small>
                    </div>
                    <div>
                        <h4>{current?.label}</h4>
                        <h2>{current?.value}</h2>
                        <small>(in Rupees)</small>
                    </div>
                </div>
            </div>}
        </div>
    )
}
