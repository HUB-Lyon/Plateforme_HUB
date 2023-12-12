import React from 'react';
import { ToastContainerProps } from '../node_modules/react-toastify/dist/types';
import { ToastOptions } from 'react-toastify';

const toastConfigs: ToastOptions = {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
};

export const toastConfig = toastConfigs;

export declare const ToastContainer: React.ForwardRefExoticComponent<ToastContainerProps & React.RefAttributes<HTMLDivElement>>;