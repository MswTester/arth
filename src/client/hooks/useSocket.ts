import { useState, useEffect, useRef } from 'react';
import io, { Socket } from 'socket.io-client';

const useSocket = (url?: string) => {
    const [socket, setSocket] = useState<Socket>(io(url));
    const urlRef = useRef(url);
    
    useEffect(() => {
        if (!urlRef.current) return;
    
        const newSocket = io(urlRef.current);
    
        setSocket(newSocket);
    
        return () => {
            newSocket.removeAllListeners();
            newSocket.disconnect();
            newSocket.close();
        };
    }, [url]);
    
    return socket;
};

export default useSocket;