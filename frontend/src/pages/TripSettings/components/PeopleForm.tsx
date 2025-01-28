import {Box, Button, Divider, Grid, Modal, TagsInput, TextInput, Title} from "@mantine/core";
import {useDisclosure} from "@mantine/hooks";
import classes from "../components/Forms.module.css";
import ProfileBanner from "./ProfileBanner.tsx";
import {useDispatch, useSelector} from "react-redux";
import {Trip} from "@trek-types/trip.ts";
import {User} from "@trek-types/user.ts";
import {useContext, useEffect, useState} from "react";
import UsersService from "../../../redux/users/service.ts";
import {AppDispatch} from "../../../redux/store.ts";
import {putTripAsync} from "../../../redux/trips/thunks.ts";
import {UserContext} from "../../../App.tsx";
import {useParams} from "react-router-dom";
import {getUserBySubAsync} from "../../../redux/users/thunks.ts";
import {clearRequested} from "../../../redux/users/reducers.ts";
import Success from "@components/alerts/Success.tsx";
import Failure from "@components/alerts/Failure.tsx";

// React component for listing all the people already in the trip, and for adding more if necessary
const PeopleForm = (): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();
    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);
    const owner = useSelector((state: { trip: { current: Trip } }) => state.trip.current.ownerUser.sub);
    console.log(owner);


    useEffect(() => {
        dispatch(clearRequested());
        if (trip.members === undefined) return;
        for (const sub of trip.members) {
            if (sub && sub !== trip.owner) {
                dispatch(getUserBySubAsync(sub));
            }
        }
        dispatch(getUserBySubAsync(owner));
    }, [dispatch, trip.members]);

    const companions = useSelector((state: { user: { requestedUsers: User[] } }) => state.user.requestedUsers);

    useEffect(() => {
        setCards(
            companions.map((user, index) => (
                <Grid.Col span={4} key={index}>
                    <ProfileBanner
                        imgSrc={(user.uploadedProfilePictureURL && user.uploadedProfilePictureURL !== "") ? user.uploadedProfilePictureURL : user.image}
                        username={user.username}
                        contact={user.email}
                        funfact={user.description}
                    />
                </Grid.Col>
            ))
        );
    }, [companions]);

    const [cards, setCards] = useState<JSX.Element[]>([]);

    return (
        <>
            <Title order={3}>Trip Companions</Title>
            <Divider my="md"/>
            <Grid className={classes.memberSpacer}>
                {cards}
                <Grid.Col span={4}>
                    <ShareTripModal/>
                </Grid.Col>
            </Grid>
        </>
    );
};

// React component for a button with an "add" symbol
const ShareTripModal = (): JSX.Element => {
    const tripUUID = useParams().uuid as string;
    const dispatch = useDispatch<AppDispatch>();
    const token = useContext(UserContext).token;

    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);
    const [usernames, setUsernames] = useState(trip.nonOwnerUsers?.map(user => user.username) || []);
    const [opened, {open, close}] = useDisclosure(false);
    const [success, setSuccess] = useState<boolean | undefined>(undefined);

    useEffect(() => {
        const newUsernames = trip.nonOwnerUsers
            ?.filter(user => user.sub !== trip.owner)
            .map(user => user.username) || [];
        setUsernames(newUsernames);
    }, [trip.nonOwnerUsers, trip.owner]);

    const handleMemberEdit = (newMembers: string[]) => {
        setUsernames(newMembers);
    };

    const handleSubmit = async () => {
        const oldUsers = trip.nonOwnerUsers
            ?.filter(user => user.sub !== trip.owner)
            .map(user => user.username) || [];
        const members: string[] = [];
        for (const username of usernames) {
            if (oldUsers.includes(username)) {
                members.push(trip.nonOwnerUsers?.find(user => user.username === username)?.sub || "");
            } else {
                try {
                    const user = await UsersService.getUserByUsername(username);
                    members.push(user.sub);
                } catch (e) {
                    console.log(username + " does not exist!");
                }
            }
        }
        // Adding the owner in if they haven't been specified
        if (!members.includes(trip.ownerUser["sub"])) {
            members.push(trip.ownerUser["sub"]);
        }
        dispatch(putTripAsync({token: token, uuid: tripUUID, trip: {...trip, members}})).unwrap()
            .then(() => setSuccess(true))
            .catch(() => setSuccess(false));
        close();
    };

    return (
        <>
            {success && <Success msg={<p>Successfully Updated Members!</p>}/>}
            {success === false && <Failure msg={<p>Something went wrong...</p>}/>}
            <Modal opened={opened} onClose={close} title="Share Trip" centered>
                <Box style={{padding: "0em 1em"}}>
                    <TagsInput
                        label="Edit members in trip"
                        value={usernames.filter((member) => member !== trip.owner)}
                        onChange={handleMemberEdit}
                    />
                    <TextInput
                        label="Set new owner"
                        placeholder="Member username"
                        classNames={{root: classes.importantModalInput}}
                    />
                    <Button className={classes.modalInput} style={{float: "right", marginBottom: "1em"}}
                            onClick={handleSubmit}>
                        Submit
                    </Button>
                </Box>
            </Modal>

            <Button variant="light" color="lime" onClick={open} fullWidth>
                Edit
            </Button>
        </>
    );
};

export default PeopleForm;
