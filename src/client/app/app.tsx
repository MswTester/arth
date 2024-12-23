import React, { useContext, useEffect } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { Container, Text } from '../components/primitives';

const App = () => {
    const { page, setPage, socket } = useGlobal();

    return <>
        <Container>
            <Text>Hello</Text>
            <input type='text' onKeyDown={e => socket.emit('keymap', e.code)} />
        </Container>
    </>
};

export default App;