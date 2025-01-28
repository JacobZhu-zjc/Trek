import {Card, Container, Stack, Group, ActionIcon, Text, Flex, Anchor, HoverCard} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import {IconCoins, IconClock, IconInfoCircle} from "@tabler/icons-react";
import {Destination} from "@trek-types/destination";
import BudgetModal from "./components/BudgetModal";
import TimeModal from "./components/TimeModal";
import {Budget} from "@trek-types/trip-item/tripItem";
import styles from "./DestinationTripItemCard.module.css";
import {getMemberProperty, Member} from "@components/ably/utils/helpers.ts";

type UpdateLocationCallback = (location: Member["location"] | null) => void;

interface DestinationTripItemCardProps {
    destination: Destination;
    previousEndTime?: Date;
    index: number;
    /** From below, try to get it from context instead of props */
    budget: Budget;
    date?: {
        start?: Date;
        end?: Date;
    },
    /** Ably member location */
    self: Member;
    cardMembers: Member[];
    setLocation: UpdateLocationCallback;
}

const DestinationTripItemCard: React.FC<DestinationTripItemCardProps> = ({
                                                                             destination,
                                                                             previousEndTime,
                                                                             index,
                                                                             budget,
                                                                             date,
                                                                             self,
                                                                             cardMembers,
                                                                             setLocation
                                                                         }) => {


    const [timeOpened, {open: timeOpen, close: timeClose}] = useDisclosure(false);
    const [budgetOpened, {open: budgetOpen, close: budgetClose}] = useDisclosure(false);

    const uri = import.meta.env.PROD ? window.location.origin : "http://localhost:3000";
    const imageUrl = destination.properties.main_photo ? (destination.properties.main_photo.sizes?.thumbnail?.url || destination.properties.main_photo.url) : undefined;
    const artist = destination.properties.main_photo?.artist;

    const handleClick = (index: number) => {
        if (self?.location?.index === index) {
            setLocation(null);
        } else {
            setLocation({index});
        }
    };

    const selfInCell = self?.location?.index === index;

    const labelColour = selfInCell
        ? self.profileData.memberColor
        : getMemberProperty(cardMembers, "memberColor") ?? "";
    const memberName = selfInCell
        ? "You"
        : getMemberProperty(cardMembers, "name") ?? "";
    const additionalCellMembers = cardMembers.length + (selfInCell ? 0 : -1);
    const cardLabel =
        additionalCellMembers > 0
            ? `${memberName} + ${additionalCellMembers}`
            : memberName;
    const cardIsEmpty = !selfInCell && cardMembers.length === 0;

    return (
        <Card
            shadow="sm"
            padding="lg"
            radius="md"
            p={0} h={"100%"} w={"100%"}
            withBorder
            style={
                {
                    '--info-bg-color': `${labelColour}`,
                    borderWidth: cardIsEmpty ? '1px' : '2px',
                    borderColor: cardIsEmpty ? '#edeff1' : labelColour,
                }
            }
            className={styles.destCard}
            data-name-content={cardLabel}
            onClick={() => handleClick(index)}>
            <Flex justify={"flex-start"} p={0} h={"100%"} w={"100%"}>

                {imageUrl &&
                    <Container
                        w={200}
                        maw={"30%"}
                        p={0}
                        m={0}
                        style={{overflow: "hidden", display: "flex", flexShrink: 0}}
                        pos={"relative"}>

                        <img
                            src={`${uri}${imageUrl}`}
                            alt={`Image of ${destination.properties.name}`}
                            style={{objectFit: 'cover', height: '100%'}}
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

                <Container h={"100%"} w={"100%"} pb={10}>
                    <Stack align="stretch" h={"100%"} justify="space-inbetween">
                        <Container p={0} h={"100%"} w={"100%"}>
                            <Group justify="space-between" mt="sm" mb="xs">
                                <Text fw={500}>{destination.properties.name}</Text>
                            </Group>
                            <Text size="xs" c="dimmed" lineClamp={2}>
                                {destination.properties.description || destination.properties.display_name}
                            </Text>
                        </Container>
                        <Group gap={"xs"}>
                            <TimeModal date={date} timezone={destination.properties.timezone}
                                       previousEndTime={previousEndTime} opened={timeOpened}
                                       name={destination.properties.name} index={index} close={timeClose}/>
                            <ActionIcon onClick={timeOpen} variant="transparent" size="sm" aria-label="Time"
                                        c={"dimmed"} p={0}>
                                <IconClock size={16}/>
                            </ActionIcon>
                            <BudgetModal budget={budget} name={destination.properties.name} index={index}
                                         open={budgetOpen} close={budgetClose} opened={budgetOpened}/>
                            <ActionIcon onClick={budgetOpen} variant="transparent" size="sm" aria-label="Budget"
                                        c={"dimmed"} p={0}>
                                <IconCoins size={16}/>
                            </ActionIcon>
                        </Group>
                    </Stack>
                </Container>
            </Flex>
        </Card>
    );
};

export default DestinationTripItemCard;
