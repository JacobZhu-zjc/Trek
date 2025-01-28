import {Container, Text, Title} from '@mantine/core';
import classes from './Error404App.module.css';

function Error401App() {
    return (
        <Container className={classes.root} my={"15%"}>
            <div className={classes.label}>401</div>
            <Title className={classes.title}>You have found a secret place.</Title>
            <Text c="dimmed" size="lg" ta="center" className={classes.description}>
                Unfortunately, you are not authorized to access this page.
            </Text>
        </Container>
    );
}

export default Error401App;
