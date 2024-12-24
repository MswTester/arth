import React from 'react';
import { Column, Container, Image } from '../components/primitives'

const LockScreen = () => {
    return <Container $center $background='background'>
        <Column $padding='xl'>
            <Image src='icon_white.svg' $width='250px'></Image>
        </Column>
    </Container>
}

export default LockScreen;