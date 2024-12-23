import React, { useContext } from 'react';
import { useGlobal } from '../contexts/GlobalContext';
import { Container, Text } from '../components/primitives';

const App = () => {
    const {page, setPage} = useGlobal();

    return <>
        <Container>
            <Text>Hello</Text>
        </Container>
    </>
};

export default App;