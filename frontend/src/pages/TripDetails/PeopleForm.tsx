import {Box, Button, Grid, Popover, TagsInput} from "@mantine/core";
import classes from "./Forms.module.css";
import ProfileBanner from "./components/ProfileBanner";
import {useDispatch, useSelector} from "react-redux";
import {Trip,User} from "../../interfaces.ts";
import {useEffect, useState} from "react";
import {getUserByUsernameAsync} from "../../redux/users/thunks.ts";
import {AppDispatch} from "../../redux/store.ts";
import {putTripAsync} from "../../redux/trips/thunks.ts";
import {clearRequested} from "../../redux/users/reducers.ts";

// React component for listing all the people already in the trip, and for adding more if necessary
const PeopleForm = (): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();
    // trip should already be GET'ed through the general form
    const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);
    useEffect(() => {
        dispatch(clearRequested());
        if (trip.members === undefined) return;
        for (const member of trip.members) {
            if (member === 'hello') continue; // skip "authenticated" user
            dispatch(getUserByUsernameAsync(member));
        }
    }, [trip.members]);
    const companions = useSelector((state: {user: {requestedUsers: User[]}}) => state.user.requestedUsers);
    const [cards, setCards] = useState(new Array<JSX.Element>());
    useEffect(() => {
        setCards(
            companions && companions.map((user, index) => (
                <Grid.Col span={4} key={index}>
                    <ProfileBanner
                        imgSrc={user.image.source}
                        username={user.username}
                        contact={user.email}
                        funfact={user.description}
                    />
                </Grid.Col>
            ))
        )
    }, [companions]);
    return (
        <Box className={classes.spacer}>
            <h2 className={classes.title}>People</h2>
            <Grid>
                {cards}
                <Grid.Col span={4}>
                    <AddIcon />
                </Grid.Col>
            </Grid>
        </Box>
    );
}

// React component for a button with an "add" symbol
const AddIcon = (): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();

    const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);
    const [members, setMembers] = useState(trip.members);

    // useEffect(() => {
    //    dispatch(putTripAsync({uuid: trip._id, trip: {...trip, members:members}}))
    // }, [members]);
    useEffect(() => {
        setMembers(trip.members);
    }, [trip.members]);

    return (
            <Popover>
                <Popover.Target>
                    <Button variant="light" color="lime" fullWidth>Edit</Button>
                </Popover.Target>
                <Popover.Dropdown>
                    <TagsInput
                        value={members && members.filter((member) => member !== 'hello')}
                        onChange={(newMembers) => {dispatch(putTripAsync({uuid: trip._id, trip: {...trip, members:newMembers}}))}}
                    />
                </Popover.Dropdown>
            </Popover>
    );
}

export default PeopleForm;
