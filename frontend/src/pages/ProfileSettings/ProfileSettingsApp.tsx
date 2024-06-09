import { Flex, Stack, Title } from '@mantine/core';
import ProfileCompletionCard from './components/ProfileCompletionCard';
import ProfileSettingsForm from './components/ProfileSettingsForm';
import UploadProfilePicture from './components/UploadProfilePicture';


const ProfileSettingsApp = () => {


    return (
        <>
            <Stack
                align="flex-start"
                justify="flex-start"
                gap="md"
                p={'20px'}
            >
                <Title order={2}>Profile Settings</Title>

                <ProfileCompletionCard />

                <Flex
                    justify="flex-end"
                    gap={'xl'}
                    align="flex-start"
                    direction="row-reverse"
                    wrap="wrap"
                    mt={'50px'}>


                    <UploadProfilePicture />

                    <ProfileSettingsForm />
                </Flex>



            </Stack>


        </>
    )
}

export default ProfileSettingsApp;