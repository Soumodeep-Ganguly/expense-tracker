import React, { useState } from 'react'
import './text.scss'

export default function Text(props) {
    const [isFocused, setIsFocused] = useState(false);

    const handleFocus = () => setIsFocused(true)

    const handleBlur = () => {
        if (!props.value) setIsFocused(false)
    };

    return (
        <div className={`text-input ${isFocused ? 'focused' : ''}`} style={props.style}>
            {props.label && <label className={`${props.variant}`}>{props.label}</label>}
            <input 
                type={props.type || "text"}
                placeholder={!props.label && props.placeholder}
                value={props.value}
                className={`${props.variant}`}
                onChange={(e) => props.onChange(e.target.value)}
                style={{ width: props.width || "100%" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
            />
        </div>
    )
}
