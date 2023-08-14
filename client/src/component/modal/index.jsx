import React from 'react';
import './index.scss';

const Modal = (props) => {

    return (
        <>
            {props.isOpen && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-header">
                            <div>
                                <h2>{props.title}</h2>
                            </div>
                            <button className="close-button" onClick={props.onClose}>
                                &times;
                            </button>
                        </div>
                        <div className="modal-content">{props.children}</div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modal;