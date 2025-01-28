import {ActionIcon, Button, Container, Flex, Title, useMantineTheme} from "@mantine/core"
import SearchInterface from "./search/SearchInterface"
import {useEffect, useState} from "react";
import ChatbotInterface from "./chatbot/ChatbotInterface";
import {useMediaQuery} from "@mantine/hooks";
import {IconListCheck, IconMapSearch, IconMessage, IconNotebook} from "@tabler/icons-react";
import ItineraryArea from "../itinerary/ItineraryArea";
import TodoInterface from "./todo/TodoInterface";


const ExploreArea = () => {

    const theme = useMantineTheme();
    const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const [exploreMode, setExploreMode] = useState("search");

    useEffect(() => {
        if (!isXs && (exploreMode === "itinerary")) {
            setExploreMode("search");
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isXs]);

    return (
        <Container maw={800} p={0} pr={15} style={{overflow: "hidden"}} h={"calc(100vh)"}>

            <Container pt={20} h={"5%"}>

                {/* Mobile Menu */}
                <Flex justify={"space-between"} align={"center"} pl={10} hiddenFrom="xs">
                    <Flex justify={"flex-start"} align={"center"} gap={"md"}>
                        <ActionIcon variant="transparent" size={"md"} area-label="Itinerary"
                                    c={exploreMode === "itinerary" ? "black" : "grey"} onClick={() => {
                            setExploreMode('itinerary')
                        }}>
                            <IconNotebook/>
                        </ActionIcon>
                        <ActionIcon variant="transparent" size={"md"} area-label="Search"
                                    c={exploreMode === "search" ? "black" : "grey"} onClick={() => {
                            setExploreMode('search')
                        }}>
                            <IconMapSearch/>
                        </ActionIcon>
                        <ActionIcon variant="transparent" size={"md"} area-label="Ask Travy"
                                    c={exploreMode === "travy" ? "black" : "grey"} onClick={() => {
                            setExploreMode('travy')
                        }}>
                            <IconMessage/>
                        </ActionIcon>
                        <ActionIcon variant="transparent" size={"md"} area-label="To-Do"
                                    c={exploreMode === "todo" ? "black" : "grey"} onClick={() => {
                            setExploreMode('todo')
                        }}>
                            <IconListCheck/>
                        </ActionIcon>
                    </Flex>
                </Flex>

                {/** Normal Menu */}
                <Flex justify={"flex-start"} gap={"md"} visibleFrom="xs">
                    <Button variant="transparent"
                            p={0}
                            c={exploreMode === "search" ? "black" : "grey"}
                            size="xs"
                            onClick={() => {
                                setExploreMode('search')
                            }}>
                        <Title order={4}>Search</Title>
                    </Button>
                    <Button variant="transparent"
                            p={0}
                            c={exploreMode === "travy" ? "black" : "grey"}
                            size="xs"
                            onClick={() => {
                                setExploreMode('travy')
                            }}>
                        <Title order={4}>Ask Travy</Title>
                    </Button>
                    <Button variant="transparent"
                            p={0}
                            c={exploreMode === "todo" ? "black" : "grey"}
                            size="xs"
                            onClick={() => {
                                setExploreMode('todo')
                            }}>
                        <Title order={4}>To-Do</Title>
                    </Button>
                </Flex>
            </Container>

            <Container pb={10} m={0} h={"95%"}>
                {exploreMode === "search" ?
                    <SearchInterface/>
                    : (exploreMode === 'todo' ?
                        <TodoInterface/>
                        : (exploreMode === 'travy' ?
                            <ChatbotInterface/>
                            : <ItineraryArea/>))}
            </Container>
        </Container>
    )
}

export default ExploreArea
