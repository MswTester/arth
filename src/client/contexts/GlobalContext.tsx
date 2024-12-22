import React, { createContext, Dispatch, SetStateAction, useContext, useState } from "react";
import { Socket } from "socket.io-client";
import useSocket from "../hooks/useSocket";

interface GlobalContextProps {
    socket: Socket;
    state: string;
    setState: Dispatch<SetStateAction<string>>;
}

const GlobalContext = createContext<GlobalContextProps|undefined>(undefined);

const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    const socket = useSocket();
    const [state, setState] = useState<string>('');

    return (
        <GlobalContext.Provider value={{ socket, state, setState }}>
            {children}
        </GlobalContext.Provider>
    );
}

const useGlobal = () => {
    const context = useContext(GlobalContext);

    if (!context) {
        throw new Error('useGlobal must be used within a GlobalProvider');
    }

    return context;
}

export { GlobalProvider, useGlobal };