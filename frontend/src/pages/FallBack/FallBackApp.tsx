import React, {ErrorInfo} from 'react';
import {Button, Container, Group, Text, Title} from '@mantine/core';
import classes from './ServerError.module.css';

interface State {
    hasError: boolean;
}

interface Props {
    children?: React.ReactNode;
}


class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {hasError: false};
    }

    static getDerivedStateFromError(_: Error) {
        return {hasError: true};
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Error caught in error boundary... YAY!: ", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className={classes.root}>
                    <Container>
                        <div className={classes.label}>Oops!</div>
                        <Title className={classes.title}>Something bad just happened...</Title>
                        <Text size="lg" ta="center" className={classes.description}>
                            Something went wrong with Trek. Don&apos;t worry, our development team was
                            already notified. Try refreshing the page.
                        </Text>
                        <Group justify="center">
                            <Button variant="white" size="md" onClick={() => location.reload()}>
                                Refresh the page
                            </Button>
                        </Group>
                    </Container>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
