import React, { useContext, useEffect, useRef } from 'react'
import { AlertContext } from '../../context/alert/AlertContextProvider';
import { AuthContext } from '../../context/auth/AuthContextProvider';

const AlertComponent = () => {

    // const { response, type } = props;

    const alertContext = useContext(AlertContext);
    const newAlert = alertContext.newAlert;
    let type = alertContext.type;
    let message = alertContext.message;
    const alertRef: any = useRef(null);

    useEffect(() => {
        if (newAlert) {
            alertRef.current.style.display = 'block';
            let duration = 3000;
            if (type === 'warn' || type === 'info') {
                duration = 5000;
            }
            setTimeout(() => {
                alertContext.clearAlert();
            }, duration);
        } else {
            alertRef.current.style.display = 'none';
        }

    }, [newAlert]);


    return (
        <div ref={alertRef} style={{ position: 'fixed', top: '150px', maxWidth: '400px', right: '40px', zIndex: 1000000 }}>
            {type === 'success' && <div className="alert alert-success" role="alert">
                {message}
            </div>}
            {type === 'info' && <div className="alert alert-info" role="alert">
                {message}
            </div>}
            {type === 'error' && <div className="alert alert-danger" role="alert">
                {message}
            </div>}
            {type === 'warn' && <div className="alert alert-warning" role="alert">
                {message}
            </div>}
        </div>
    )
}

export default AlertComponent;