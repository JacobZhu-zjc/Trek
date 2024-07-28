import { IconShare3 } from '@tabler/icons-react';
import { Card, Image, Text, Group, Button, ActionIcon, Avatar } from '@mantine/core';
import classes from './BadgeCard.module.css';
import { Link } from 'react-router-dom';
import {/*useDispatch,*/ useSelector} from "react-redux";
// import {useEffect} from "react";
// import {getTripAsync} from "../redux/trips/thunks.ts";
// import {BasicTrip, Trip} from "@trek-types/trip.ts";
// import {AppDispatch} from '../redux/store.ts';
import {State} from "@trek-types/redux.ts";

function AltTripCard({uuid}: {uuid: string}) {
    // const dispatch = useDispatch<AppDispatch>();

    // console.log("Refreshing alttripcard");
    // useEffect(() => {
        // console.log("Sending getTripAsync with uuid" + uuid);
        // dispatch(getTripAsync(uuid));
    // }, [uuid]);

    const trips = useSelector((state: State) => state.trip.basicTrips);
    const trip = trips.find(trip => trip._id === uuid);
    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section>
                <Image src={trip?.mainImage} alt={trip?.name} height={180} />
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group justify="apart">
                    <Text fz="lg" fw={500}>
                        {trip?.name}
                    </Text>
                </Group>
                <Text fz="sm" mt="xs">
                    {trip?.desc}
                </Text>
            </Card.Section>

            {/* TODO: Change so it pulls from list of users associated with trip*/}
            <Card.Section className={classes.section}>
                <Avatar.Group>
                    <Avatar src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z" />
                    <Avatar src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/photo_2010.jpeg?itok=CrQV58Be" />
                    <Avatar src="https://pbs.twimg.com/profile_images/487564770401210368/DIC26oA__400x400.jpeg" />
                    <Avatar>+5</Avatar>
                </Avatar.Group>
            </Card.Section>

            <Group mt="xs">
                <Link to={`/trip/${uuid}/overview`}>
                    <Button radius="md" color='green' style={{ flex: 1 }}>
                        View Trip
                    </Button>
                </Link>
                <ActionIcon variant="default" radius="md" size={36}>
                    <IconShare3 stroke={1.5} />
                </ActionIcon>
            </Group>
        </Card>
    );
}

export default AltTripCard;
