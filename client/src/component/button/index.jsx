import React from 'react'
import './index.scss'

export default function Button(props) {
    return (
        <div className='dev-button' style={props.style}>
            <button
                onClick={() => props.onClick()}
                className={`${props.variant}`}
                style={{ width: props.width || "100%" }}
            >
                {props.text}
            </button>
        </div>
    )
}
