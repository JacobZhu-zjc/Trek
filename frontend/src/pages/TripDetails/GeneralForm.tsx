import {useEffect, useState} from 'react';
import {Box, Button, Group, NumberInput, TagsInput, Text, TextInput} from "@mantine/core";
import { DatePickerInput } from '@mantine/dates';
import { Dropzone } from '@mantine/dropzone';
import { IconCurrencyDollar, IconUpload, IconPhoto, IconX } from '@tabler/icons-react';
import classes from "./Forms.module.css";
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import {useDispatch, useSelector} from "react-redux";
import {getTripAsync} from "../../redux/trips/thunks.ts";
import {Trip} from "../../interfaces.ts";
import {AppDispatch} from '../../redux/store.ts';

const megaList = ["Vancouver, BC", "Toronto, ON", "Shanghai, China", "São Pãulo, Brazil", "Seoul, South Korean", "Paris, France", "Barcelona, Spain", "Milan, Italy", "Luxembourg"];

// React component for the form accepting general information about a trip
const GeneralForm = (): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getTripAsync("960e5cd5-c783-4c02-a4b4-3579a674a2d0"));
    }, []);

    const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);
    const [dests, setDests] = useState(trip.dest);

    useEffect(() => {
        setDests(trip.dest);
    }, [trip]);

    return (
        <Box className={classes.spacer}>
            <Box className={classes.leftBox}>
                <h2 className={classes.title}>General</h2>
            </Box>
            <Box className={classes.rightBox}>
                <Button variant="outline" color="teal" size="lg" className={classes.submitButton}>
                    Update Info
                </Button><br/>
            </Box>

            <Box className={classes.leftBox}>
                <TextInput label="Trip Name" placeholder={trip.name === "" ? "Our awesome trip!" : ""} value={trip.name} className={classes.input} />
                {/*<TextInput label="Destination" placeholder={trip.destination === "" ? "Where to?" : trip.destination} className={classes.input} />*/}
                <TagsInput
                    label="Destinations"
                    placeholder={dests && dests.length > 0 ? "" : "Where would you like to go?"}
                    data={megaList}
                    value={dests}
                    onChange={(newDests) => {setDests(newDests)}}
                    />
                <DateRangePicker />
                <BudgetPicker />
            </Box>
            <Box className={classes.rightBox}>
                <ImageSubmission />
            </Box>
        </Box>
    );
}

// React component for Mantine's date picker, but allowing range selection
// Code attribution: Mantine documentation, https://mantine.dev/dates/date-picker/
const DateRangePicker = (): JSX.Element => {
    const [value, setValue] = useState<[Date | null, Date | null]>([null, null]);
    return <DatePickerInput label="Trip Dates" placeholder="Pick a date range" type="range" value={value} onChange={setValue} className={classes.input} />;
}

// React component for picking price ranges
const BudgetPicker = (): JSX.Element => {
    const dollarIcon = <IconCurrencyDollar className={classes.dollarSignIcon} />;
    return (
        <Box className={classes.imageSubmissionSpacer}>
            Total Budget <br/>
            <NumberInput
                leftSectionPointerEvents="none"
                leftSection={dollarIcon}
                placeholder="Low estimate"
                className={classes.input}
                style={{ display: "inline-block", width: "calc(50% - 5px)", padding: "0em 1em 1em 0em" }}
                hideControls
            />
            -
            <NumberInput
                leftSectionPointerEvents="none"
                leftSection={dollarIcon}
                placeholder="High estimate"
                className={classes.input}
                style={{ display: "inline-block", width: "calc(50% - 5px)", padding: "0em 0em 1em 1em" }}
                hideControls
            />
        </Box>
    );
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
