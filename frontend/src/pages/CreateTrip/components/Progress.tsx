import {rem, Stepper} from '@mantine/core';
import {IconCircleCheck, IconCoins, IconMapPin, IconShare} from '@tabler/icons-react';
import {FC} from 'react';

interface ProgressProps {
    active: number;
}


const Progress: FC<ProgressProps> = ({active}) => {

    return (
        <Stepper active={active}>
            <Stepper.Step icon={<IconMapPin style={{width: rem(18), height: rem(18)}}/>}/>
            <Stepper.Step icon={<IconCoins style={{width: rem(18), height: rem(18)}}/>}/>
            <Stepper.Step icon={<IconShare style={{width: rem(18), height: rem(18)}}/>}/>
            <Stepper.Step icon={<IconCircleCheck style={{width: rem(18), height: rem(18)}}/>}/>
        </Stepper>
    );
}

export default Progress;
