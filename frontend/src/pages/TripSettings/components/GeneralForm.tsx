import {Button, Center, Divider, Group, Textarea, TextInput, Title} from "@mantine/core";
import TrekIcon from "@assets/T-Initial-Dark.svg";
import {DatePickerInput} from "@mantine/dates";
import {useContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {UserContext} from "../../../App";
import {AppDispatch} from "../../../redux/store";
import {putTripAsync} from "../../../redux/trips/thunks";
import {Trip} from "@trek-types/trip";
import {Feature} from 'geojson';
import {AreaMultiselect} from "@components/destination-search-boxes/AreaMultiselect";
import {Notifications, notifications} from '@mantine/notifications';
import ImageSubmission from "./ImageSubmission";
import {Destination, SimpleDestination} from "@trek-types/destination.ts";


const GeneralForm = (): JSX.Element => {

    const dispatch = useDispatch<AppDispatch>();
    const userContext = useContext(UserContext);
    const token = userContext.token;
    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);

    const [name, setName] = useState(trip.name);
    const [desc, setDesc] = useState(trip.desc);
    const [dests, setDests] = useState<(Destination | Feature)[]>(trip.destObjs as unknown as Feature[]);

    const [dateRange, setDateRange] = useState<[Date | null, Date | null]>(
        trip.date ?
            [new Date(trip.date.start), new Date(trip.date.end)]
            : [null, null]
    );
    // const [selectedFeature, setSelectedFeature] = useState<any>(null);

    useEffect(() => {
        setName(trip.name);
        setDesc(trip.desc);
        setDests(trip.destObjs as unknown as Destination[]);
        setDateRange([new Date(trip.date ? trip.date.start : 0), new Date(trip.date ? trip.date.end : 0)]);
    }, [trip]);

    function handleSubmit() {
        const toPut: Trip = {
            ...trip,
            name: name,
            desc: desc,
            destObjs: dests as unknown as SimpleDestination[],
            date: {
                start: dateRange[0] || new Date(0),
                end: dateRange[1] || new Date(0)
            },
            owner: trip.owner.sub as string,
        };
        delete toPut.trip_items;
        dispatch(putTripAsync({uuid: trip._id, token: token, trip: toPut})).unwrap()
            .then(() => {
                notifications.show({
                    color: "green",
                    title: "Trip Updated",
                    message: 'Trip Information Successfully Updated!',
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

    return (<>
        <Notifications limit={5}/>
        <Title order={3}>General Trip Settings</Title>
        <Divider my="md"/>
        <Group justify={"space-between"} w={"70%"}>
            <Title order={5}>Trip Name</Title>
            <TextInput
                radius="xl"
                w={"50%"}
                miw={"300px"}
                maw={"700px"}
                inputSize="xl"
                value={name}
                onChange={(event) => {
                    setName(event.currentTarget.value)
                }}
                required
                leftSection={
                    <Center
                        h={"100%"}
                        w={"100%"}
                        className="w-64 h-32 rounded-l-full">
                        <img style={{height: "50%"}} src={TrekIcon} alt={""}/>
                    </Center>}/></Group>

        <Divider my="md"/>

        <Group justify={"space-between"} w={"70%"}>
            <Title order={5}>Locations</Title>

            <AreaMultiselect
                selectedFeatures={dests}
                setSelectedFeatures={setDests}
                pillsInputProps={{
                    w: "50%",
                    miw: "300px",
                    maw: "700px",
                    radius: "xl"
                }}/>

        </Group>


        <Divider my="md"/>

        <Group justify={"space-between"} w={"70%"}>
            <Title order={5}>Trip Dates</Title>

            <DatePickerInput
                type="range"
                radius={"xl"}
                value={dateRange}
                onChange={setDateRange}
                w={"50%"}
                miw={"300px"}
                maw={"700px"}/>

        </Group>


        <Divider my="md"/>

        <Title order={5}>Trip Main Image</Title>
        <ImageSubmission/>
        <Divider my="md"/>

        <Group justify={"space-between"} w={"70%"}>
            <Title order={5}>Trip Description</Title>
            <Textarea
                radius="lg"
                w={"50%"}
                miw={"300px"}
                value={desc}
                onChange={(event) => {
                    setDesc(event.currentTarget.value)
                }}
                autosize
                minRows={5}
                maxRows={5}
                maw={"700px"}/>
        </Group>

        <Group justify="flex-end" mt="xl">
            <Button variant="filled" color="green" radius="xl" onClick={handleSubmit}>Update Trip</Button>
        </Group>
    </>)

};

export default GeneralForm;
