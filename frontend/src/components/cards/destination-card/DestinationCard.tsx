import {ActionIcon, Anchor, Box, Card, Container, Flex, Group, HoverCard, Stack, Text} from "@mantine/core";
import {IconInfoCircle} from "@tabler/icons-react";
import {Destination} from "@trek-types/destination";

interface DestinationCardProps {
    destination: Destination;
}

const DestinationCard: React.FC<DestinationCardProps> = ({destination}) => {
    const uri = import.meta.env.PROD ? window.location.origin : "http://localhost:3000";

    const imageUrl = destination.properties.main_photo ? (destination.properties.main_photo.sizes?.thumbnail?.url || destination.properties.main_photo.url) : undefined;
    const artist = destination.properties.main_photo?.artist;

    return (
        <Card shadow="sm" padding="lg" radius="md" p={0} w={"100%"} withBorder>
            <Flex justify={"flex-start"} p={0}>
                {imageUrl &&
                    <Container
                        w={200}
                        maw={"30%"}
                        h="100%"
                        p={0}
                        m={0}
                        style={{overflow: "hidden", display: "flex", flexShrink: 0}}
                        pos={"relative"}>

                        <img
                            src={`${uri}${imageUrl}`}
                            alt={`Image of ${destination.properties.name}`}
                            style={{objectFit: 'cover'}}
                        />
                        {artist &&
                            <Stack className="absolute bottom-0" justify="flex-end" align="flex-end">

                                <HoverCard width={200} shadow="md">
                                    <HoverCard.Target>
                                        <ActionIcon variant="light" color="white" size="sm" radius="xl"
                                                    aria-label="Settings">
                                            <IconInfoCircle style={{width: '70%', height: '70%'}} stroke={3}/>
                                        </ActionIcon>
                                    </HoverCard.Target>
                                    <HoverCard.Dropdown>
                                        <Text size="xs">Photo by {artist}</Text>
                                        <Text size="xs" tt="uppercase"><Anchor target="_blank"
                                                                               href={destination.properties.main_photo?.license_url || ''}>{destination.properties.main_photo?.license}</Anchor></Text>
                                    </HoverCard.Dropdown>
                                </HoverCard>
                            </Stack>}
                    </Container>}

                <Container pb={10} m={0} w={destination.properties.main_photo ? undefined : "100%"}>

                    <Flex direction="column" h={"100%"} w={"100%"}>
                        <Container p={0} w={"100%"}>
                            <Group w={"100%"} justify="space-between" mt="sm" mb="xs" gap={0}>
                                {/* Title of Suggested Item */}
                                <Box maw={"85%"}>
                                    <Text fw={500} lineClamp={2}>
                                        {destination.properties.name}
                                    </Text>
                                </Box>
                            </Group>
                        </Container>
                        <Box flex={1}>
                            <Text size="xs" c="dimmed" lineClamp={3}>
                                {destination.properties.description || destination.properties.display_name}
                            </Text>
                        </Box>
                    </Flex>
                </Container>
            </Flex>
        </Card>)
}

export default DestinationCard;
