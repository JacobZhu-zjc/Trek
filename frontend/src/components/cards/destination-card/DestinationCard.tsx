import { ActionIcon, Avatar, Box, Card, Container, Flex, Group, Image, rem, Text, Tooltip } from "@mantine/core";
import { Icon, IconBookmark, IconBookmarkFilled, IconHeart, IconHeartFilled, IconPlus, IconSquareRoundedMinus } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Destination } from "@trek-types/destination";
import { getIconForCategory, getColorForCategory } from "@utils/place";

// some placeholder user data for now
interface User {
    name: string;
    email: string;
    id: string;
    profilePicture: string;
}

interface DestinationCardProps {
    destination: Destination;
    /** Rest of the Props should be from Redux Store */
    // isLiked: boolean;
    // isSaved: boolean;
    isWishlist: boolean;
    // wishlistAddedBy: {
    //     name: string;
    //     profilePicture: string;
    // }
}




const DestinationCard: React.FC<DestinationCardProps> = ({ destination, isWishlist }) => {

    /** @todo These should be from the Redux store */
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const [wishlistAddedBy, setWishlistAddedBy] = useState<User | false>(false);
    useEffect(() => {
        if (isWishlist) {
            setWishlistAddedBy({
                name: "Gregor Kiczales",
                email: "gregor@cs.ubc.ca",
                id: "1",
                profilePicture: "https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z"
            })
        }
        console.log("Wishlist: " + isWishlist);
    }, [isWishlist]);



    const [placeCategory, setPlaceCategory] = useState<{ name: string, color: string, icon: Icon } | false>(false);

    useEffect(() => {
        if (destination.properties.destination_type === "poi" && destination.properties.poi_category) {

            const name = destination.properties.poi_category;
            const color = getColorForCategory(name);
            const icon = getIconForCategory(name);
            setPlaceCategory({ name, color, icon });
        }
    }, [destination]);

    return (
        <Card shadow="sm" padding="lg" radius="md" p={0} h={150} w={"100%"} withBorder>

            <Flex justify={"flex-start"} p={0}>

                {destination.properties.main_photo &&
                    <Container
                        w={200}
                        maw={"30%"}
                        h="100%"
                        p={0}
                        style={{ overflow: "hidden", display: "flex", flexShrink: 0 }}
                        pos={"relative"}>
                        <Image
                            src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                            alt="Norway"
                            width="100%"
                            height="100%"
                            object-fit="cover"
                        />
                    </Container>}

                <Container h={150} pb={10} w={destination.properties.main_photo ? undefined : "100%"}>
                    {/* <Stack align="stretch" justify="space-inbetween"> */}

                    <Flex direction="column" h={"100%"}>
                        <Container p={0} w={"100%"}>
                            <Group w={"100%"} justify="space-between" mt="sm" mb="xs" gap={0}>
                                {/* Title of Suggested Item */}
                                <Box maw={"85%"}>
                                    <Text fw={500} lineClamp={2}>
                                        {destination.properties.name}
                                    </Text>
                                </Box>

                                {/* Category of Suggested Item (only if POI) */}
                                {placeCategory && (<Tooltip label={placeCategory.name}>
                                    <ActionIcon
                                        variant="filled"
                                        size="sm"
                                        color={placeCategory.color}
                                        radius={"xl"}>
                                        <placeCategory.icon style={{ width: rem(16), height: rem(16) }} />
                                    </ActionIcon>
                                </Tooltip>)}
                            </Group>
                        </Container>



                        <Box flex={1}>
                            <Text size="xs" c="dimmed" lineClamp={3}>
                                {destination.properties.description || destination.properties.display_name}
                            </Text>
                        </Box>

                        <Group justify="space-between">
                            <Group gap={"xs"}>
                                <Tooltip label="Like this Place">
                                    <ActionIcon variant="transparent" size="sm" aria-label="Like" c={"red"} p={0} onClick={() => { setIsLiked(!isLiked) }}>
                                        {!isLiked ? <IconHeart /> : <IconHeartFilled />}
                                    </ActionIcon>
                                </Tooltip>

                                {!isWishlist ?
                                    (<Tooltip label="Add to Trip Wishlist">
                                        <ActionIcon variant="transparent" size="sm" aria-label="Add to Trip Wishlist" c={"black"} p={0}>
                                            <IconPlus />
                                        </ActionIcon>
                                    </Tooltip>) :
                                    (<Tooltip label="Remove from Trip Wishlist">
                                        <ActionIcon variant="transparent" size="sm" aria-label="Remove from Trip Wishlist" c={"black"} p={0}>
                                            <IconSquareRoundedMinus />
                                        </ActionIcon>
                                    </Tooltip>)}

                                <Tooltip label="Save this Place">
                                    <ActionIcon variant="transparent" size="sm" aria-label="Add to Trip" c={"black"} p={0} onClick={() => { setIsSaved(!isSaved) }}>
                                        {!isSaved ? <IconBookmark /> : <IconBookmarkFilled />}
                                    </ActionIcon>
                                </Tooltip>

                            </Group>

                            {wishlistAddedBy && <Tooltip label={`Added by ${wishlistAddedBy.name}`}>
                                <Link to="#">
                                    <Avatar src={wishlistAddedBy.profilePicture} size={30} radius="xl" />
                                </Link>
                            </Tooltip>
                            }
                        </Group>
                    </Flex>






                    {/* </Stack> */}

                </Container>

            </Flex>

        </Card>)

}

export default DestinationCard;