import {useEffect, useState} from "react";
import {animate, motion, useMotionValue, useTransform} from "framer-motion";
import {Container, Paper, Stack, Text} from "@mantine/core";
import DestinationCard from "../../../../../components/cards/destination-card/DestinationCard";
import classes from './markdownRenderer.module.css';
import {d1, d2, d3} from "@trek-types/examples/destinationExamples";

interface BotMessageBubbleProps {
    stream: string;
    setIsInputDisabled: (isDisabled: boolean) => void;
    setIsScrollable: (isScrollable: boolean) => void;
}

const BotMessageBubble: React.FC<BotMessageBubbleProps> = ({stream, setIsInputDisabled, setIsScrollable}) => {
    const [currentCardIndex, setCurrentCardIndex] = useState<number>(-1); // State for managing card display
    const count = useMotionValue(0);
    const rounded = useTransform(count, (latest) => Math.round(latest));
    const displayText = useTransform(rounded, (latest) =>
        stream.slice(0, latest)
    );

    useEffect(() => {
        setIsScrollable(true);
    }, [displayText, currentCardIndex]);

    useEffect(() => {
        setIsInputDisabled(true);
        const controls = animate(count, stream.length, {
            type: "tween",
            delay: 2,
            duration: stream.length * 0.01,
            ease: "easeInOut",
            onComplete: () => {
                setIsInputDisabled(false);
                const cardDisplayInterval = setInterval(() => {
                    setCurrentCardIndex((prevIndex) => {
                        if (prevIndex < 2) {
                            return prevIndex + 1;
                        } else {
                            clearInterval(cardDisplayInterval);
                            return prevIndex;
                        }
                    });
                }, 200);

                // Cleanup for card display interval
                return () => clearInterval(cardDisplayInterval);
            }
        });
        return controls.stop;
    }, [stream]);

    const destinations = [d1, d2, d3]; // Array of destinations for easier mapping

    return (
        <Paper shadow="xs" radius="lg" p={20}>
            <Text size="sm" mb={5}>Travy:</Text>
            <div className={classes.markdown + " font-lexend"}>
                <motion.div>{displayText}</motion.div>
                <Container p={0} mt={10}>
                    <Stack>
                        {destinations.slice(0, currentCardIndex + 1).map((destination, index) => (
                            <DestinationCard key={index} destination={destination}/>
                        ))}
                    </Stack>
                </Container>
            </div>
        </Paper>
    );
}

export default BotMessageBubble;
