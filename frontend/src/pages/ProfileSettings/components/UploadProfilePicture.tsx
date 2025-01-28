import {Paper, Avatar, Button, Modal, Title, Stack, Group, Text} from '@mantine/core';
import {useDispatch, useSelector} from "react-redux";
import {useContext, useEffect, useState} from "react";
import {getUserAsync, putUserPictureAsync} from "../../../redux/users/thunks.ts";
import {BasicUser} from "@trek-types/user.ts";
import {AppDispatch} from '../../../redux/store.ts';
import {UserContext} from '../../../App.tsx';
import {useDisclosure} from '@mantine/hooks';
import {Dropzone} from '@mantine/dropzone';
import {IconPhoto, IconUpload, IconX} from '@tabler/icons-react';
import classes from "./ProfileCompletionCard.module.css";
import Success from '@components/alerts/Success.tsx';
import Failure from '@components/alerts/Failure.tsx';

function UploadProfilePicture() {
    const dispatch = useDispatch<AppDispatch>();
    const userContext = useContext(UserContext);
    const profile = useSelector((state: { user: { self: BasicUser } }) => state.user.self);
    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        // FIXME: token doesn't exist when reloaded on the current page
        dispatch(getUserAsync({token: userContext.token}));
    }, [dispatch, userContext.token, profile.uploadedProfilePictureURL]);

    // Mantine Hook for maintaining modal displayed/not displayed state
    const [opened, {open, close}] = useDisclosure(false);
    const MAX_IMAGE_SIZE: number = 5 * (1024 ** 2);

    const handleSubmit = (files: File[]) => {
        const formData = new FormData();
        formData.append("uploadedProfilePicture", files[0]);
        close();

        setSuccess(null);
        dispatch(putUserPictureAsync({
            token: userContext.token,
            data: formData,
        })).unwrap()
            .then(() => setSuccess(true))
            .catch(() => setSuccess(false));
    };

    const handleDelete = () => {
        setSuccess(null);
        dispatch(putUserPictureAsync({
            token: userContext.token,
            data: new FormData(),
        })).unwrap()
            .then(() => setSuccess(true))
            .catch(() => setSuccess(false));
    };

    return (
        <>
            <Modal opened={opened} onClose={close} title="Authentication">
                <Dropzone className={classes.dropZone}
                          onDrop={(files) => handleSubmit(files)}
                          onReject={(files) => console.error("Image files rejected, too large or wrong format ", files)}
                          maxSize={MAX_IMAGE_SIZE}
                          accept={["image/png", "image/jpeg", "image/sgv+xml", "image/gif"]}
                          multiple={false}
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
            </Modal>


            <Stack>
                <Title order={4}>Profile Picture</Title>
                <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
                    <Avatar
                        src={(profile.uploadedProfilePictureURL && profile.uploadedProfilePictureURL !== "") ? profile.uploadedProfilePictureURL : profile.image}
                        size={120}
                        radius={120}
                        mx="auto"
                    />
                    <Button variant="filled" fullWidth mt="md" onClick={open}>
                        Upload Profile Picture
                    </Button>
                    <Button variant="default" fullWidth mt="md" onClick={handleDelete}>
                        Remove Profile Picture
                    </Button>
                </Paper>

                {success && <Success/>}
                {success === false && <Failure/>}
            </Stack>
        </>
    );
}

export default UploadProfilePicture;
