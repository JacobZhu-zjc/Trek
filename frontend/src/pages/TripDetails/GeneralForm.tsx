import {useContext, useEffect, useState} from 'react';
import {Box, Button, Group, TagsInput, Text, Textarea, TextInput} from "@mantine/core";
import { DatePickerInput } from '@mantine/dates';
import { Dropzone } from '@mantine/dropzone';
import { IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import classes from "./Forms.module.css";
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import {useDispatch, useSelector} from "react-redux";
import {getTripAsync, putTripAsync} from "../../redux/trips/thunks.ts";
import {Trip} from "@trek-types/trip.ts";
import {AppDispatch} from '../../redux/store.ts';
import {useParams} from "react-router-dom";
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from '../../App.tsx';

const megaList = ["Vancouver, BC", "Toronto, ON", "Shanghai, China", "São Pãulo, Brazil", "Seoul, South Korea", "Paris, France", "Barcelona, Spain", "Milan, Italy", "Luxembourg"];

// React component for the form accepting general information about a trip
const GeneralForm = (): JSX.Element => {
    const tripUUID = useParams().uuid as string;
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated } = useAuth0();
    const userContext = useContext(UserContext);
    const token = userContext.token;

    useEffect(() => {
        if (isAuthenticated) {
          dispatch(getTripAsync({uuid: tripUUID, token: token}));
        }
    }, [dispatch, isAuthenticated, token]);

    const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);
    const [name, setName] = useState(trip.name);
    const [desc, setDesc] = useState(trip.desc);
    const [dests, setDests] = useState(trip.dest);
    const [value, setValue] = useState<[Date | null, Date | null]>(
        trip.date ?
            [new Date(trip.date.start), new Date(trip.date.end)]
            : [null, null]
    );

    useEffect(() => {
        setName(trip.name);
        setDesc(trip.desc);
        setDests(trip.dest);
        setValue([new Date(trip.date ? trip.date.start : 0), new Date(trip.date ? trip.date.end : 0)]);
    }, [trip]);

    function handleSubmit() {
        const toPut: Trip = {
            ...trip,
            name:name,
            desc:desc,
            dest:dests,
            date: {
                start: value[0] || new Date(0),
                end: value[1] || new Date(0)
            }
        };
        toPut.owner = trip.owner.sub as string;
        void toPut;
        dispatch(putTripAsync({uuid: trip._id, token: token, trip: toPut}));
    }

    return (
        <Box className={classes.spacer}>
            <Box className={classes.leftBox}>
                <h2 className={classes.title}>General</h2>
            </Box>
            <Box className={classes.rightBox}>
                <Button variant="outline" color="teal" size="lg" onClick={handleSubmit} className={classes.submitButton}>
                    Update Info
                </Button><br/>
            </Box>

            <Box className={classes.leftBox}>
                <TextInput
                    label="Trip Name"
                    placeholder={name === "" ? "Our awesome trip!" : ""}
                    value={name}
                    onChange={(event) => {setName(event.currentTarget.value)}}
                    className={classes.input} />
                <Textarea
                    label="Trip Description"
                    placeholder={desc === "" ? "Our trip that goes to..." : ""}
                    value={desc}
                    onChange={(event) => {setDesc(event.currentTarget.value)}}
                    className={classes.input} />
                <TagsInput
                    // TODO: change how this works once Destinations API is implemented
                    label="Destinations"
                    placeholder={dests && dests.length > 0 ? "" : "Where would you like to go?"}
                    data={megaList}
                    value={dests}
                    onChange={(newDests) => {setDests(newDests)}}
                    className={classes.input}
                    />
                <DateRangePicker value={value} setValue={setValue} />
            </Box>
            <Box className={classes.rightBox}>
                <ImageSubmission />
            </Box>
        </Box>
    );
}

// React component for Mantine's date picker, but allowing range selection
// Code attribution: Mantine documentation, https://mantine.dev/dates/date-picker/
const DateRangePicker = ({value, setValue}: {
    value: [Date | null, Date | null],
    setValue: React.Dispatch<React.SetStateAction<[Date | null, Date | null]>>
}): JSX.Element => {
    return <DatePickerInput label="Trip Dates" placeholder="Pick a date range" type="range" value={value} onChange={setValue} className={classes.input} />;
}

// Mantine component for an image dropbox and image preview
// Code attribution: Mantine documentation, https://mantine.dev/x/dropzone/
const ImageSubmission = (): JSX.Element => {
    const MAX_IMAGE_SIZE: number = 5 * (1024 ** 2);

    return (
        <Box className={classes.imageSubmissionSpacer}>
            Image Upload
            <Dropzone
                onDrop={(files) => console.log("accepted files", files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={MAX_IMAGE_SIZE}
                accept={["image/png", "image/jpeg", "image/sgv+xml", "image/gif"]}
                multiple={false}
                className={classes.dropZone}
            >
                <Group gap="xl" mih={220} style={{ pointerEvents: "none" }}>
                    <Dropzone.Accept>
                        <IconUpload className={classes.uploadIcon} stroke={1.5} />
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX className={classes.rejectIcon} stroke={1.5} />
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto className={classes.photoIcon} stroke={1.5} />
                    </Dropzone.Idle>

                    <div>
                        <Text size="lg" inline>
                            Drag images here or click to select image file
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Your file should not exceed 5mb
                        </Text>
                    </div>
                </Group>
            </Dropzone>
        </Box>
    );
}

export default GeneralForm;
