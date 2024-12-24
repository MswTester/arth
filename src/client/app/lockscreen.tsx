import React from 'react';
import { Column, Container, Image, Text } from '../components/primitives'

const LockScreen = () => {
    return <Container $center $background='background'>
        <Column>
            <Image src='icon_black.svg' $width='250px'></Image>
        </Column>
        <Column>
            <Text $align="center">Test</Text>
        </Column>
    </Container>
}

export default LockScreen;
