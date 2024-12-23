import styled from 'styled-components';

const cvt = (value: string | number) => {
    if(typeof value === 'number') return `${value}px`;
    switch(value){
        case 'full': return '100%';
        case 'half': return '50%';
        case 'start': return 'flex-start';
        case 'end': return 'flex-end';
        default: return value;
    }
}

const Div = styled.div<{
    $padding?: string;
    $margin?: string;
}>`
    padding: ${props => props.$padding || '0'};
    margin: ${props => props.$margin || '0'};
`;

const Flex = styled(Div)<{
    $justify?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
    $items?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    $wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
    $gap?: string;
    $width?: string;
    $height?: string;
}>`
    display: flex;
    justify-content: ${props => cvt(props.$justify || 'center')};
    align-items: ${props => cvt(props.$items || 'center')};
    flex-wrap: ${props => props.$wrap || 'nowrap'};
    gap: ${props => cvt(props.$gap || '0')};
    width: ${props => cvt(props.$width || 'auto')};
    height: ${props => cvt(props.$height || 'auto')};
`;

const Row = styled(Flex)<{
    $reverse?: boolean;
}>`
    flex-direction: ${props => props.$reverse ? 'row-reverse' : 'row'};
`;

const Column = styled(Flex)<{
    $reverse?: boolean;
}>`
    flex-direction: ${props => props.$reverse ? 'column-reverse' : 'column'};
`;

const Container = styled(Div)<{
    $center?: boolean;
}>`
    display: flex;
    justify-content: ${props => props.$center ? 'center' : 'flex-start'};
    align-items: ${props => props.$center ? 'center' : 'flex-start'};
    width: 100%;
    height: 100%;
`;

const Overlay = styled(Container)<{
    $color?: string;
    $opacity?: number;
}>`
    position: absolute;
    top: 0;
    left: 0;
    background-color: ${props => cvt(props.$color || 'rgba(0, 0, 0, 0.5)')};
    opacity: ${props => cvt(props.$opacity || 1)};
`;

const Float = styled(Div)<{
    $position?: 'top' | 'right' | 'bottom' | 'left' | 'center' | 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
    $distance?: string;
}>`
    position: fixed;
    top: ${props => props.$position === 'top' || props.$position === 'top-right' || props.$position === 'top-left' ? cvt(props.$distance || '0') : props.$position === 'center' ? '50%' : "auto" };
    right: ${props => props.$position === 'right' || props.$position === 'top-right' || props.$position === 'bottom-right' ? cvt(props.$distance || '0') : "auto" };
    bottom: ${props => props.$position === 'bottom' || props.$position === 'bottom-right' || props.$position === 'bottom-left' ? cvt(props.$distance || '0') : "auto" };
    left: ${props => props.$position === 'left' || props.$position === 'top-left' || props.$position === 'bottom-left' ? cvt(props.$distance || '0') : props.$position === 'center' ? '50%' : "auto" };
    transform: ${props => props.$position === 'center' ? 'translate(-50%, -50%)' : 'none'};
`;

const Text = styled(Div)<{
    $size?: string;
    $weight?: string;
    $color?: string;
    $align?: 'left' | 'right' | 'center' | 'justify';
    $transform?: 'uppercase' | 'lowercase' | 'capitalize';
}>`
    font-size: ${props => cvt(props.$size || '16px')};
    font-weight: ${props => cvt(props.$weight || 400)};
    color: ${props => props.$color || 'black'};
    text-align: ${props => props.$align || 'left'};
    text-transform: ${props => props.$transform || 'none'};
`;

export { Div, Flex, Row, Column, Container, Overlay, Float, Text };