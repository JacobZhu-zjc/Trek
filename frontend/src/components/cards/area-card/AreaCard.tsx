import { ActionIcon, Box, Card, Container, Flex, Group, Image, Text, Tooltip } from "@mantine/core";
import { IconBookmark, IconBookmarkFilled, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { useState } from "react";
import { Area } from "../../../types/destination";

export interface AreaCardProps {
    area: Area;
}

const AreaCard = ({ area }: AreaCardProps) => {

    /**
     * @todo these should be pulled from Redux store
     * or from the backend.
     */
    const [isLiked, setIsLiked] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    return (
        <Card shadow="sm" padding="lg" radius="md" p={0} h={150} withBorder>

            <Flex justify={"flex-start"} p={0}>

                {area.properties.main_photo &&
                    <Container
                        w={200}
                        maw={"30%"}
                        h="100%"
                        p={0}
                        style={{ overflow: "hidden", display: "flex", flexShrink: 0 }}
                        pos={"relative"}>
                        <Image
                            src={area.properties.main_photo}
                            alt={area.properties.name}
                            width="100%"
                            height="100%"
                            object-fit="cover"
                        />
                    </Container>}

                <Container h={150} pb={10}>
                    {/* <Stack align="stretch" justify="space-inbetween"> */}

                    <Flex direction="column" h={"100%"}>
                        <Container p={0} w={"100%"}>
                            <Group w={"100%"} justify="flex-start" mt="sm" mb="xs" gap={0}>
                                <Box maw={"85%"}>
                                    <Text fw={500} lineClamp={2}>
                                        {area.properties.name}
                                    </Text>
                                </Box>
                            </Group>
                        </Container>



                        <Box flex={1}>
                            <Text size="xs" c="dimmed" lineClamp={3}>
                                {area.properties.description}
                            </Text>
                        </Box>

                        <Group justify="space-between">
                            <Group gap={"xs"}>
                                <Tooltip label="Like this Place">
                                    <ActionIcon variant="transparent" size="sm" aria-label="Like" c={"red"} p={0} onClick={() => { setIsLiked(!isLiked) }}>
                                        {!isLiked ? <IconHeart /> : <IconHeartFilled />}
                                    </ActionIcon>
                                </Tooltip>

                                <Tooltip label="Save this Place">
                                    <ActionIcon variant="transparent" size="sm" aria-label="Add to Trip" c={"black"} p={0} onClick={() => { setIsSaved(!isSaved) }}>
                                        {!isSaved ? <IconBookmark /> : <IconBookmarkFilled />}
                                    </ActionIcon>
                                </Tooltip>

                            </Group>

                        </Group>
                    </Flex>






                    {/* </Stack> */}

                </Container>

            </Flex>

        </Card>)

}

export default AreaCard;