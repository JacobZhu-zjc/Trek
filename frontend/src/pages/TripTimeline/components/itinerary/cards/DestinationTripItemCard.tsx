import { Card, Container, Stack, Group, ActionIcon, Text } from "@mantine/core";
import { IconCoins, IconClock } from "@tabler/icons-react";
// import { DestinationTripItem } from "../../../types";

// interface DestinationTripItemCardProps {
//     destination: DestinationTripItem;
// }

const DestinationTripItemCard: React.FC = () => {
    return (
        <Card shadow="sm" padding="lg" radius="md" p={0} h={130} withBorder>
            <Container h={100}>
                <Stack align="stretch" justify="space-inbetween">
                    <Container p={0} h={"100%"}>
                        <Group justify="space-between" mt="sm" mb="xs">
                            <Text fw={500}>Norway Fjord Adventures</Text>
                        </Group>
                        <Text size="xs" c="dimmed">
                            With Fjord Tours you can explore more of the magical fjord landscapes with tours and activities on and around the fjords of Norway
                        </Text>
                    </Container>
                    <Group gap={"xs"}>
                        <ActionIcon variant="transparent" size="sm" aria-label="Budget" c={"dimmed"} p={0}>
                            <IconCoins size={16} />
                        </ActionIcon>
                        <ActionIcon variant="transparent" size="sm" aria-label="Time" c={"dimmed"} p={0}>
                            <IconClock size={16} />
                        </ActionIcon>
                    </Group>
                </Stack>
            </Container>
        </Card>
    );
};

export default DestinationTripItemCard;