import {Button, Divider, Group, Select, Text, Title} from "@mantine/core";
import CurrencyAutocomplete from "@components/input-selects/CurrencyAutocomplete";
import {useContext, useEffect, useState} from "react";
import {modals} from "@mantine/modals";
import {useAuth0} from "@auth0/auth0-react";
import {useDispatch, useSelector} from "react-redux";
import {useNavigate, useParams} from "react-router-dom";
import {UserContext} from "../../../App";
import {AppDispatch} from "../../../redux/store";
import {deleteTripAsync, putManagementAsync, putTripAsync} from "../../../redux/trips/thunks";
import {Trip} from "@trek-types/trip";
import {Notifications, notifications} from "@mantine/notifications";
import UsersService from "../../../redux/users/service.ts";


const AdvancedForm = (): JSX.Element => {

    const dispatch = useDispatch<AppDispatch>();
    const userContext = useContext(UserContext);
    const {isAuthenticated} = useAuth0();
    const token = userContext.token;
    const uuid = useParams().uuid as string;
    const navigation = useNavigate();
    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);

    const [selectedCurrency, setSelectedCurrency] = useState("CAD");
    const [isPrivate, setIsPrivate] = useState(trip.private);

    useEffect(() => {
        setSelectedCurrency(trip.budget.baseCurrency);
        setIsPrivate(trip.private);
    }, [trip])

    function handleSubmit() {
        const toPut: Trip = {
            ...trip,
            budget: {
                ...trip.budget,
                baseCurrency: selectedCurrency
            },
            private: isPrivate,
        }
        delete toPut.trip_items;
        dispatch(putTripAsync({uuid: trip._id, token: token, trip: toPut})).unwrap()
            .then(() => {
                notifications.show({
                    color: "green",
                    title: "Trip Updated",
                    message: 'Budget Successfully Updated!',
                    radius: 'lg'
                })
            })
            .catch(() =>
                notifications.show({
                    color: "red",
                    title: "Trip Update Failed",
                    message: 'Please try again later',
                    radius: 'lg'
                }));
    }


    /**
     * Delete Trip Modal
     */

    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Delete your trip',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete your trip? Once you delete it, all your trip data will be lost.
                </Text>
            ),
            labels: {confirm: 'Delete this trip', cancel: "No don't delete it"},
            confirmProps: {color: 'red'},
            onCancel: () => console.log('Cancel'),
            onConfirm: async () => {
                if (isAuthenticated) {
                    dispatch(deleteTripAsync({token: userContext.token, tripUUID: uuid})).unwrap()
                        .then(() => navigation("/profile"));
                }
                console.log("Confirmed");
            },
        });

    return (<>
        <Notifications limit={5}/>

        <Title order={3}>Advanced Trip Settings</Title>
        <Divider my="md"/>
        <Group justify={"space-between"} w={"70%"}>
            <Title order={5}>Base Currency</Title>
            <CurrencyAutocomplete
                value={selectedCurrency}
                setValue={setSelectedCurrency}
                props={{
                    radius: "xl",
                    w: "50%",
                    miw: "300px",
                    maw: "700px"
                }}/>
        </Group>


        <Divider my="md"/>

        <Group justify={"space-between"} w={"70%"}>
            <Title order={5}>Trip Owner</Title>

            <Select
                radius="xl"
                w="50%"
                miw="300px"
                maw="700px"
                allowDeselect={false}
                value={trip.ownerUser.username}
                onChange={async (username) => {
                    if (username !== null) {
                        dispatch(putManagementAsync({
                            token: token,
                            tripUUID: trip._id,
                            data: {...trip, "owner": (await UsersService.getUserByUsername(username))["sub"]}
                        })).unwrap()
                            .then((json) => {
                                if (json["error"] !== undefined) {
                                    throw new Error();
                                }
                                notifications.show({
                                    color: "green",
                                    title: "Trip Owner Updated",
                                    message: null,
                                    radius: 'lg'
                                })
                            })
                            .catch(() =>
                                notifications.show({
                                    color: "red",
                                    title: "Trip Update Failed",
                                    message: 'Please try again later',
                                    radius: 'lg'
                                })
                            );
                    }
                }}
                data={trip.nonOwnerUsers.map(member => member.username)}/>
        </Group>

        <Divider my="md"/>

        <Group justify={"space-between"} w={"70%"}>
            <Title order={5}>Access Control</Title>

            <Select
                radius="xl"
                w="50%"
                miw="300px"
                maw="700px"
                allowDeselect={false}
                value={isPrivate ? 'Private' : 'Public'}
                onChange={(val) => {
                    val === 'Private'
                        ? setIsPrivate(true)
                        : setIsPrivate(false);
                }}
                data={['Private', 'Public']}/>
        </Group>

        <Group justify="flex-end" my="xl">
            <Button variant="filled" color="green" radius="xl" onClick={handleSubmit}>Update Advanced Settings</Button>
        </Group>


        <Divider my="xl"/>

        <Group justify={"space-between"} w={"70%"}>
            <Title order={5}>Delete Trip</Title>

            <Group
                justify="flex-start"
                w={"50%"}
                miw={"300px"}
                maw={"700px"}>
                <Button radius={"xl"} onClick={openDeleteModal} color="red">Permanently Delete trip</Button>
            </Group>
        </Group>


    </>)

};

export default AdvancedForm;
