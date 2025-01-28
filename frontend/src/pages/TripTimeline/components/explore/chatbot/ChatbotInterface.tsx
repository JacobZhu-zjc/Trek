import {ActionIcon, Container, Flex, rem, ScrollAreaAutosize, Stack, Textarea} from "@mantine/core";
import {IconArrowRight} from "@tabler/icons-react";
import {useCallback, useContext, useEffect, useMemo, useRef, useState} from "react";
import WelcomeDisplay from "./components/WelcomeDisplay";
import {Message} from "./types";
import UserMessageBubble from "./components/UserMessageBubble";
import BotMessageBubble from "./components/BotMessageBubble";
import {State} from "@trek-types/redux";
import {useSelector} from "react-redux";
import {UserContext} from "../../../../../App";
import {Destination} from "@trek-types/destination";

const ChatbotInterface = () => {
    const hostname = import.meta.env.PROD ? window.location.origin : "http://localhost:3000"
    const API_URL = `${hostname}/api/v1/`;
    const uuid = useSelector((state: State) => state.trip.current?._id);
    const userExperience = useSelector((state: State) => state.user.self.experience);
    const [messages, setMessages] = useState<Message[]>([]);
    const [ongoingStreamMessage, setOngoingStreamMessage] = useState<string | null>(null);
    const [userInput, setUserInput] = useState<string>('');
    const [isScrollable, setIsScrollable] = useState<boolean>(true);
    const [maxCharsLabel, setMaxCharsLabel] = useState<string>('');
    const viewport = useRef<HTMLDivElement>(null);
    const userContext = useContext(UserContext);
    const token = userContext.token;

    const scrollToBottom = () => {
        if (viewport.current) {
            viewport.current!.scrollTo({top: viewport.current!.scrollHeight, behavior: 'instant'});
        }
    };

    useEffect(() => {
        scrollToBottom();
        setIsScrollable(false);
    }, [messages, isScrollable]);

    useEffect(() => {
        scrollToBottom();
        setIsScrollable(false);
    }, [ongoingStreamMessage, isScrollable]);

    useEffect(() => {
        const token = userContext.token;
        let botResponse = null;
        let data = null;
        (async () => {
            botResponse = await fetch(`${API_URL}chatbot/${uuid}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!botResponse.ok) {
                console.error("Failed to fetch chatbot messages");
                return;
            }
            data = await botResponse.json();
            data.sort(messageComparator);
            data = data.map((item: {
                _id: string,
                text: string,
                sender: string,
                timestamp: string,
                destinationsResolved: Destination[]
            }) => {
                return {
                    id: item._id,
                    text: item.text,
                    sender: item.sender,
                    timestamp: item.timestamp,
                    destinations: item.destinationsResolved,
                };
            });
            if (data) {
                setMessages(data);
            }
        })();
    }, [])

    const handleUserInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (event.currentTarget.value.length > 500) {
            setMaxCharsLabel('You can only send up to 500 characters.');
            return;
        }
        setMaxCharsLabel('');
        setUserInput(event.currentTarget.value);
    };

    const messageComparator = useCallback((a: Message, b: Message): number => {
        if (a.timestamp < b.timestamp) {
            return -1;
        } else if (a.timestamp > b.timestamp) {
            return 1;
        } else {
            return 0;
        }
    }, []);

    const sendMessage = async (currentUserInput: string) => {
        const timestamp = new Date().getTime();
        const userMessage: Message = {
            id: timestamp,
            text: currentUserInput.replace(/\n/g, "\\n"),
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages((prevMessages: Message[]) => [...prevMessages, userMessage]);
        setUserInput('');

        const response = await fetch(`${API_URL}chatbot/${uuid}/stream`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({
                uuid: uuid as string,
                text: userMessage.text,
                sender: "user",
                userExperience: userExperience,
            })
        });

        const stream = response.body;
        if (!stream) {
            return;
        }

        const reader = stream.getReader();
        if (reader) {
            setOngoingStreamMessage('');
            const decoder = new TextDecoder();
            let accumulatedText = '';
            let destinationArray: Destination[] = [];
            let isDestinationArray = false;

            try {
                let messageDone = false;
                while (!messageDone) {
                    const {done, value} = await reader.read();
                    if (done) break;
                    if (value) {
                        if (isDestinationArray) {
                            const destinationResponse = decoder.decode(value, {stream: !done});
                            const destinations = JSON.parse(destinationResponse);
                            destinationArray = destinations;
                            isDestinationArray = false;
                            messageDone = true;
                            break;
                        } else {
                            const text = decoder.decode(value, {stream: !done});
                            if (text.includes('\n\n<DONE>\n\n')) {
                                const splitText = text.split('\n\n<DONE>\n\n');
                                accumulatedText += splitText[0];
                                isDestinationArray = true;
                            } else {
                                accumulatedText += text;
                                setOngoingStreamMessage(accumulatedText);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error("Stream reading error:", error);
            } finally {
                setMessages(prev => [...prev, {
                    id: timestamp + 1,
                    text: accumulatedText as string,
                    sender: 'assistant',
                    destinations: destinationArray,
                    timestamp: new Date()
                }]);
                setOngoingStreamMessage(null);
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSubmit();
        }
    };

    const handleSubmit = async () => {
        await sendMessage(userInput);
    };

    const messagesMemo = useMemo(() => messages.map((msg) =>
        msg.sender === 'user' ?
            <UserMessageBubble key={msg.id} message={msg.text || ''}/> :
            <BotMessageBubble key={msg.id} text={msg.text || ''} destinations={msg.destinations} id={msg.id}/>
    ), [messages])

    return (
        <Flex direction="column" h="100%" gap={0} pt={"10"} mb={0} pb={0}>
            <ScrollAreaAutosize mah={"100%"} m={0} my={20} flex={1} viewportRef={viewport}>
                <Stack mx={20} mb={10} h={"100%"}>
                    {messagesMemo}
                    {ongoingStreamMessage &&
                        <BotMessageBubble key={`ongoing-${new Date().toDateString()}`} text={ongoingStreamMessage}/>}
                </Stack>
            </ScrollAreaAutosize>

            {messages.length === 0 && <WelcomeDisplay/>}

            <Container w={"100%"} p={0}>
                <Textarea
                    size="md"
                    radius="lg"
                    autosize
                    minRows={1}
                    maxRows={7}
                    placeholder="Ask Travy a question about your Trip!"
                    onKeyDown={handleKeyDown}
                    onChange={handleUserInput}
                    label={maxCharsLabel}
                    value={userInput}
                    mx={20}
                    c="green"
                    rightSection={
                        <ActionIcon size={32} radius="xl" variant="gradient"
                                    gradient={{from: 'teal', to: 'lime', deg: 90}}
                                    onClick={handleSubmit}>
                            <IconArrowRight style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                        </ActionIcon>}
                />
            </Container>
        </Flex>
    )
}

export default ChatbotInterface;
