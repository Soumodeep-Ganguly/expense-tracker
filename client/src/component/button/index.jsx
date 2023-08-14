import React from 'react'
import { UilSpinner } from '@iconscout/react-unicons'
import './index.scss'

export default function Button(props) {
    return (
        <div className='dev-button' style={props.style}>
            <button
                onClick={() => props.onClick()}
                className={`${props.variant} ${props.className}`}
                style={{ width: props.width || "100%" }}
                disabled={props.loading}
            >
                {props.loading?<UilSpinner size={20} style={{ marginTop: -5, marginBottom: -5 }} className="rotate" />:props.text}
            </button>
        </div>
    )
}
