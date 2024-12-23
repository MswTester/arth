import React, { useContext } from 'react';
import { useGlobal } from '../contexts/GlobalContext';

const App = () => {
    const {page, setPage} = useGlobal();

    return <>
        <h1>Arth</h1>
    </>
};

export default App;