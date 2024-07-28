import { Text, ActionIcon, /*Box,*/ Button, Container, em, Flex, rem, Title, useMantineTheme } from "@mantine/core"
import SearchInterface from "./search/SearchInterface"
import { useEffect, useState } from "react";
import ChatbotInterface from "./chatbot/ChatbotInterface";
import WishlistInterface from "./wishlist/WishlistInterface";
import { useMediaQuery } from "@mantine/hooks";
import ItineraryArea from "../itinerary/ItineraryArea";
import { IconCalendarEvent, IconMapSearch, IconMessage, IconNotebook, IconStar, IconStarFilled } from "@tabler/icons-react";


const ExploreArea = () => {

    const theme = useMantineTheme();
    const isXs = useMediaQuery(`(max-width: ${theme.breakpoints.xs})`);
    const [exploreMode, setExploreMode] = useState("search");

    useEffect(() => {
        console.log(isXs);
        console.log(em(parseFloat(theme.breakpoints.xs)));
        if (!isXs && (exploreMode === "itinerary")) {
            setExploreMode("search");
            console.log("inside " + exploreMode);
        }
        console.log(exploreMode);
    }, [isXs]);

    return (
        <Container maw={800} p={0} pr={15} style={{ overflow: "hidden" }} h={"calc(100vh)"}>

            <Container pt={20} h={"5%"}>

                {/* Mobile Menu */}

                <Flex justify={"space-between"} align={"center"} pl={10} hiddenFrom="xs">

                    <Flex justify={"flex-start"} align={"center"} gap={"md"}>
                        <ActionIcon variant="transparent" size={"md"} area-label="Itinerary" c={exploreMode === "itinerary" ? "black" : "grey"} onClick={() => { setExploreMode('itinerary') }}>
                            <IconNotebook />
                        </ActionIcon>
                        <ActionIcon variant="transparent" size={"md"} area-label="Search" c={exploreMode === "search" ? "black" : "grey"} onClick={() => { setExploreMode('search') }}>
                            <IconMapSearch />
                        </ActionIcon>
                        <ActionIcon variant="transparent" size={"md"} area-label="Wishlist" c={exploreMode === "wishlist" ? "black" : "grey"} onClick={() => { setExploreMode('wishlist') }}>
                            {exploreMode === 'wishlist' ? <IconStarFilled /> : <IconStar />}
                        </ActionIcon>
                        <ActionIcon variant="transparent" size={"md"} area-label="Ask Travy" c={exploreMode === "travy" ? "black" : "grey"} onClick={() => { setExploreMode('travy') }}>
                            <IconMessage />
                        </ActionIcon>
                    </Flex>

                    <Button variant="transparent">
                        <IconCalendarEvent style={{ color: "grey", width: rem(20), height: rem(20) }} />
                        <Text ml={5} fw="700" c="dimmed" size="sm">8/7/2024</Text>
                    </Button>
                </Flex>


                {/** Normal Menu */}
                <Flex justify={"flex-start"} gap={"md"} visibleFrom="xs">

                    <Button variant="transparent"
                        p={0}
                        c={exploreMode === "search" ? "black" : "grey"}
                        size="xs"
                        onClick={() => { setExploreMode('search') }}>
                        <Title order={4}>Search</Title>
                    </Button>
                    <Button variant="transparent"
                        p={0}
                        c={exploreMode === "wishlist" ? "black" : "grey"}
                        size="xs"
                        onClick={() => { setExploreMode('wishlist') }}>
                        <Title order={4}>Wishlist</Title>
                    </Button>
                    <Button variant="transparent"
                        p={0}
                        c={exploreMode === "travy" ? "black" : "grey"}
                        size="xs"
                        onClick={() => { setExploreMode('travy') }}>
                        <Title order={4}>Ask Travy</Title>
                    </Button>
                </Flex>
            </Container>

            <Container pb={10} m={0} h={"95%"}>
                {exploreMode === "search" ?
                    <SearchInterface />
                    : (exploreMode === 'wishlist' ?
                        <WishlistInterface />
                        : (exploreMode === 'travy' ?
                            <ChatbotInterface />
                            : <ItineraryArea />))}
            </Container>
        </Container>
    )
}

export default ExploreArea