import {IconShare3} from '@tabler/icons-react';
import {Card, Image, Text, Group, Button, ActionIcon, Avatar, AspectRatio} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import classes from './BadgeCard.module.css';
import {Link} from 'react-router-dom';
import {useSelector} from "react-redux";
import {State} from "@trek-types/redux.ts";
import {notifications} from "@mantine/notifications";
import DefaultPhoto from "@assets/default-trip-cover.jpg"

function AltTripCard({uuid}: { uuid: string }) {

    const trips = useSelector((state: State) => state.trip.basicTrips);
    const trip = trips.find(trip => trip._id === uuid);
    const users = trip ? [...trip.nonOwnerUsers] : [];
    // Including the owner if they haven't been included already
    if (trip && trip?.ownerUser !== null) {
        if (!users.map(user => user.sub).includes(trip.ownerUser.sub)) {
            users.push(trip.ownerUser);
        }
    }
    const firstUsers = users.slice(0, 3);
    const remainingUsers = (users.slice(3).length) ?? 0;
    const remainingUsersGT0 = remainingUsers > 0;
    const isPhoneScreen = useMediaQuery('(max-width: 600px)');

    function handleShare() {
        const origin = window.location.origin;
        navigator.clipboard.writeText(origin + `/trip/${uuid}/overview`);
        notifications.show({
            color: 'green',
            title: 'Trip link copied to clipboard!',
            message: '',
            radius: 'lg'
        });
    }

    return (
        <Card withBorder radius="md" p="md" className={classes.card}
              style={{width: (isPhoneScreen) ? "135px" : "300px", height: "440px"}} miw={300}>
            <Card.Section>
                <AspectRatio ratio={1080 / 720} w={"100%"}>
                    <Image src={(trip?.mainImageURL && trip?.mainImageURL !== "") ? trip?.mainImageURL : DefaultPhoto}
                           alt={trip?.name} fit="cover"/>
                </AspectRatio>
            </Card.Section>

            <Card.Section className={classes.section} mt="md" style={{height: "250px"}}>
                <Group justify="apart">
                    <Text fz="lg" fw={500} lineClamp={1}>
                        {trip?.name}
                    </Text>
                </Group>
                <Text fz="sm" mt="xs" lineClamp={2}>
                    {trip?.desc}
                </Text>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Avatar.Group>
                    {
                        firstUsers?.map(user => {
                            const u = user.uploadedProfilePictureURL;
                            const i = user.image;
                            return <Avatar src={(u && u != "") ? u : i}/>
                        })
                    }
                    {remainingUsersGT0 && (
                        <Avatar>+{remainingUsers}</Avatar>
                    )}
                </Avatar.Group>
            </Card.Section>

            <Group mt="xs">
                <Link to={`/trip/${uuid}/overview`}>
                    <Button radius="md" color='green' style={{flex: 1}}>
                        View Trip
                    </Button>
                </Link>
                <ActionIcon variant="default" radius="md" size={36} onClick={handleShare}>
                    <IconShare3 stroke={1.5}/>
                </ActionIcon>
            </Group>
        </Card>
    );
}

export default AltTripCard;
