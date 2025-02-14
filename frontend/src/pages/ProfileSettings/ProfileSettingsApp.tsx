import {useEffect} from 'react';
import {Flex, Stack, Title} from '@mantine/core';
import ProfileSettingsForm from './components/ProfileSettingsForm';
import UploadProfilePicture from './components/UploadProfilePicture';

const ProfileSettingsApp = () => {
    /** Set Page Title To "Profile Settings" */
    useEffect(() => {
        document.title = "Profile Settings";
    }, []);


    return (
        <>
            <Stack
                align="flex-start"
                justify="flex-start"
                gap="md"
                p={'20px'}
            >
                <Title order={2}>Profile Settings</Title>


                <Flex
                    justify="flex-end"
                    gap={'xl'}
                    align="flex-start"
                    direction="row-reverse"
                    wrap="wrap"
                    mt={'50px'}>


                    <UploadProfilePicture/>

                    <ProfileSettingsForm/>
                </Flex>


            </Stack>


        </>
    )
}

export default ProfileSettingsApp;
