// Mantine component for an image dropbox and image preview

import {Group, Text} from "@mantine/core";
import {Dropzone} from "@mantine/dropzone";
import {IconPhoto, IconUpload, IconX} from "@tabler/icons-react";
import {Trip} from "@trek-types/trip";
import {useContext} from "react";
import {useDispatch, useSelector} from "react-redux";
import {UserContext} from "../../../App";
import {AppDispatch} from "../../../redux/store";
import {putPhotosAsync} from "../../../redux/trips/thunks";
import classes from "./Forms.module.css";
import {notifications, Notifications} from "@mantine/notifications";


// Code attribution: Mantine documentation, https://mantine.dev/x/dropzone/
const ImageSubmission = (): JSX.Element => {
    const MAX_IMAGE_SIZE: number = 5 * (1024 ** 2);
    const dispatch = useDispatch<AppDispatch>();
    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);
    const userContext = useContext(UserContext);
    const token = userContext.token;

    const handleSubmit = (files: File[]) => {
        const formData = new FormData();

        for (const file of files) {
            formData.append("photos", file);
        }

        dispatch(putPhotosAsync({
            token: token,
            tripUUID: trip._id,
            data: formData,
        })).unwrap()
            .then(() => {
                notifications.show({
                    color: "green",
                    title: "Trip Updated",
                    message: 'Image Successfully Uploaded!',
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

    return (
        <>
            <Notifications limit={5}/>
            <Dropzone
                onDrop={(files) => handleSubmit(files)}
                onReject={(files) => console.log("rejected files", files)}
                maxSize={MAX_IMAGE_SIZE}
                accept={["image/png", "image/jpeg", "image/sgv+xml", "image/gif"]}
                multiple={true}
                className={classes.dropZone}
            >
                <Group gap="xl" mih={220} style={{pointerEvents: "none"}}>
                    <Dropzone.Accept>
                        <IconUpload className={classes.uploadIcon} stroke={1.5}/>
                    </Dropzone.Accept>
                    <Dropzone.Reject>
                        <IconX className={classes.rejectIcon} stroke={1.5}/>
                    </Dropzone.Reject>
                    <Dropzone.Idle>
                        <IconPhoto className={classes.photoIcon} stroke={1.5}/>
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
        </>
    );
}

export default ImageSubmission
