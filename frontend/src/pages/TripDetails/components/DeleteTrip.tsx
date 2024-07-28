import {Text, Button, Box} from '@mantine/core';
import { modals } from '@mantine/modals';
import classes from "./../Forms.module.css";
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../../redux/store.ts";
import {deleteTripAsync} from "../../../redux/trips/thunks.ts";
import {useContext} from 'react';
import {UserContext} from '../../../App.tsx';
import {useAuth0} from '@auth0/auth0-react';
import {useNavigate, useParams} from 'react-router-dom';



function DeleteTrip() {
    const dispatch = useDispatch<AppDispatch>();
    const userContext = useContext(UserContext);
    const {isAuthenticated} = useAuth0();
    const uuid = useParams().uuid as string;
    const navigation = useNavigate();

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Delete your trip',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete your trip? Once you delete it, all your trip data will be lost.
                </Text>
            ),
            labels: { confirm: 'Delete this trip', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                if (isAuthenticated) {
                    dispatch(deleteTripAsync({token: userContext.token, tripUUID: uuid})).unwrap()
                    .then(() => navigation("/profile"));
                }
                console.log("Confirmed");
            },
        });

    return (
        <Box className={classes.spacer}>
            <h2 className={classes.title}>Delete trip</h2>
            <Box style={{width: "calc(100%)"}}>
                <Button className={classes.input} mt="20px" ml="20px" onClick={openDeleteModal} color="red">Delete trip</Button>
            </Box>
        </Box>
    );
}

export default DeleteTrip;
