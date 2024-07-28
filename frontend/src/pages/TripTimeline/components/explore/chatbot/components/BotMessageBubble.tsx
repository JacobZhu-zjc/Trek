import { useEffect, useState } from "react";
import { Container, Paper, Stack, Text } from "@mantine/core";
import DestinationCard from "../../../../../../components/cards/destination-card/DestinationCard";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classes from './markdownRenderer.module.css';
import { p5, p7, p9 } from "@trek-types/examples/destinationExamples";

interface BotMessageBubbleProps {
    stream: string;
    setIsInputDisabled: (isDisabled: boolean) => void;
    setIsScrollable: (isScrollable: boolean) => void;
}

const BotMessageBubble: React.FC<BotMessageBubbleProps> = ({ stream, setIsInputDisabled, setIsScrollable }) => {
    const [message, setMessage] = useState<string>('');
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(-1); // New state for managing card display
    const botMessageRaw = stream.split(' ');

    useEffect(() => {
        setIsScrollable(true);
    }, [message, currentCardIndex]);

    useEffect(() => {
        setIsInputDisabled(true);
        let currentIndex = 0;
        let botMessageAccumulator = '';
        const intervalId = setInterval(() => {
            if (currentIndex < botMessageRaw.length) {
                botMessageAccumulator += botMessageRaw[currentIndex] + ' ';
                setMessage(botMessageAccumulator);
                currentIndex++;
            } else {
                clearInterval(intervalId);
                setIsInputDisabled(false);
                // Start displaying cards one by one after the message is fully displayed
                const cardDisplayInterval = setInterval(() => {
                    setCurrentCardIndex((prevIndex) => {
                        if (prevIndex < 2) { // There are 3 cards, index 0 to 2
                            return prevIndex + 1;
                        } else {
                            clearInterval(cardDisplayInterval);
                            return prevIndex;
                        }
                    });
                }, 50); // Adjust delay as needed

                // Cleanup for card display interval
                return () => clearInterval(cardDisplayInterval);
            }
        }, 125);

        // Cleanup function to clear the message interval when the component unmounts
        return () => clearInterval(intervalId);
    }, [stream]);

    const destinations = [p5, p7, p9]; // Array of destinations for easier mapping

    return (
        <Paper shadow="xs" radius="lg" p="md">
            <Text size="sm" mb={5}>Travy:</Text>
            <div className={classes.markdown}>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{message}</ReactMarkdown>
                <Container p={0} mt={10}>
                    <Stack>
                        {destinations.slice(0, currentCardIndex + 1).map((destination, index) => (
                            <DestinationCard key={index} destination={destination} isWishlist={false} />
                        ))}
                    </Stack>
                </Container>
            </div>
        </Paper>
    );
}

export default BotMessageBubble;