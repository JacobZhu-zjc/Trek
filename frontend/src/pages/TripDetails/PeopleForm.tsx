import { Box, Button, Grid, Modal, TagsInput, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import classes from "./Forms.module.css";
import ProfileBanner from "./components/ProfileBanner";
import { useDispatch, useSelector } from "react-redux";
import { Trip } from "@trek-types/trip.ts";
import { User } from "@trek-types/user.ts"
import { useEffect, useState } from "react";
import {getUserByIDAsync} from "../../redux/users/thunks.ts";
import { AppDispatch } from "../../redux/store.ts";
// import { putTripAsync } from "../../redux/trips/thunks.ts";
import { clearRequested } from "../../redux/users/reducers.ts";

// React component for listing all the people already in the trip, and for adding more if necessary
const PeopleForm = (): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();
    // trip should already be GET'ed through the general form
    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);
    useEffect(() => {
        dispatch(clearRequested());
        if (trip.members === undefined) return;
        for (const member of trip.members) {
            if (member === 'hello') continue; // skip "authenticated" user
            dispatch(getUserByIDAsync(member));
        }
    }, [dispatch, trip.members]);

    const companions = useSelector((state: { user: { requestedUsers: User[] } }) => state.user.requestedUsers);
    const [cards, setCards] = useState(new Array<JSX.Element>());
    useEffect(() => {
        setCards(
            companions && companions.map((user, index) => (
                <Grid.Col span={4} key={index}>
                    <ProfileBanner
                        imgSrc={user.image}
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
            <Grid className={classes.memberSpacer}>
                {cards}
                <Grid.Col span={4}>
                    <ShareTripModal />
                </Grid.Col>
            </Grid>
        </Box>
    );
};

// React component for a button with an "add" symbol
const ShareTripModal = (): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();
    void dispatch; // TOOD delete

    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);
    const [usernames, setUsernames] = useState(trip.nonOwnerUsers?.map(user => user._id));
    const [opened, { open, close }] = useDisclosure(false);

    // useEffect(() => {
    //    dispatch(putTripAsync({uuid: trip._id, trip: {...trip, members:members}}))
    // }, [members]);
    useEffect(() => {
        setUsernames(trip.members);
    }, [trip.members]);

    return (
        <>
            <Modal opened={opened} onClose={close} title="Share Trip" centered>
                <Box style={{padding: "0em 1em"}}>
                    {/* <TextInput label="Add new member" placeholder="Member username" className={classes.modalInput} />
                    <TextInput label="Remove member" placeholder="Member username" className={classes.modalInput} /> */}
                    <TagsInput
                        label="Edit members in trip"
                        value={usernames && usernames.filter((member) => member !== 'hello')}
                        // onChange={(newMembers) => {dispatch(putTripAsync({uuid: trip._id, trip: {...trip, members:newMembers}}))}}
                    />
                    <TextInput label="Set new owner" placeholder="Member username" classNames={{root: classes.importantModalInput}} />
                    <Button className={classes.modalInput} style={{float: "right", marginBottom: "1em"}} >Submit</Button>
                </Box>
            </Modal>

            <Button variant="light" color="lime" onClick={open} fullWidth>Edit</Button>
        </>
    );
}

export default PeopleForm;
