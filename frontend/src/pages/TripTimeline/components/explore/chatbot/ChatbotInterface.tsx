import { ScrollAreaAutosize, Stack, Textarea, ActionIcon, rem, Container, Flex } from "@mantine/core";
import { IconArrowRight } from "@tabler/icons-react";
import { useEffect, useRef, useState } from "react";
import WelcomeDisplay from "./components/WelcomeDisplay";
import { Message } from "./types";
import UserMessageBubble from "./components/UserMessageBubble";
import BotMessageBubble from "./components/BotMessageBubble";
import { preconfiguredMessage } from "./preconfiguredMessage";


const ChatbotInterface = () => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [userInput, setUserInput] = useState<string>('');
    const [isInputDisabled, setIsInputDisabled] = useState<boolean>(false);
    const [isScrollable, setIsScrollable] = useState<boolean>(false);
    const [maxCharsLabel, setMaxCharsLabel] = useState<string>('');
    const viewport = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (viewport.current) {
            viewport.current!.scrollTo({ top: viewport.current!.scrollHeight, behavior: 'instant' });
        }
    };

    useEffect(() => {
        scrollToBottom();
        setIsScrollable(false);
    }, [messages, isScrollable]);

    const handleUserInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {

        // max characters = 500
        if (event.currentTarget.value.length > 500) {
            setMaxCharsLabel('You can only send up to 500 characters.');
            return;
        }
        setMaxCharsLabel('');
        setUserInput(event.currentTarget.value);
    }


    const sendMessage = () => {

        const timestamp = new Date().getTime()

        const userMessage: Message = {
            id: timestamp,
            text: userInput.replace(/\n/g, "\\n"),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prevMessages: Message[]) => [...prevMessages, userMessage]);
        setUserInput('');

        const botMessageRaw = preconfiguredMessage;

        const botMessage: Message = {
            id: timestamp + 1,
            text: botMessageRaw,
            sender: 'bot',
            timestamp: new Date(),
        };

        setMessages((prevMessages: Message[]) => [...prevMessages, botMessage]);
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = () => {
        sendMessage();
    };

    return (
        <>

            <Flex direction="column" h="100%" gap={0} pt={"10"} mb={0} pb={0}>


                <ScrollAreaAutosize mah={"100%"} m={0} my={20} flex={1} viewportRef={viewport}>

                    <Stack mx={20} mb={10} h={"100%"}>

                        {messages.map((msg) =>
                            msg.sender === 'user' ?
                                <UserMessageBubble key={msg.id} message={msg.text} /> :
                                <BotMessageBubble key={msg.id} stream={msg.text} setIsInputDisabled={setIsInputDisabled} setIsScrollable={setIsScrollable} />)}
                    </Stack>
                </ScrollAreaAutosize>

                {messages.length === 0 &&
                    <WelcomeDisplay />}

                <Container w={"100%"} p={0}>
                    <Textarea
                        size="md"
                        radius="lg"
                        autosize
                        minRows={1}
                        maxRows={7}
                        // error="An error occured. Please try again later."
                        placeholder="Ask Travy a question about your Trip!"
                        onKeyDown={handleKeyDown}
                        onChange={handleUserInput}
                        label={maxCharsLabel}
                        value={userInput}
                        disabled={isInputDisabled}
                        mx={20}
                        c="green"
                        rightSection={
                            <ActionIcon size={32} radius="xl" variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 90 }}
                                onClick={sendMessage}>
                                <IconArrowRight style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                            </ActionIcon>}
                    />
                </Container>

            </Flex>


        </>
    )

}


export default ChatbotInterface;