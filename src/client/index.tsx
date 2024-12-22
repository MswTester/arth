import React from 'react';
import ReactDOM from 'react-dom/client';
import { GlobalProvider } from './contexts/GlobalContext';
import App from './app/app';
import "../styles/global.css";

const Index = () => {
    return <GlobalProvider>
        <App />
    </GlobalProvider>
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(<Index />);
