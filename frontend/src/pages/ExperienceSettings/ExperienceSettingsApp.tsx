import {useEffect} from 'react';
import {Text, Stack, Title} from '@mantine/core';
import ExperienceSettingsForm from './components/ExperienceSettingsForm';


const ExperienceSettingsApp = () => {
    /** Set Page Title To "User Experience Settings" */
    useEffect(() => {
        document.title = "User Experience Settings";
    }, []);

    return (
        <>
            <Stack
                align="flex-start"
                justify="flex-start"
                gap="md"
                p={'20px'}
            >
                <Title order={2}>Experience Settings</Title>
                <Text c="dimmed" size="sm">
                    Customize your experience on Trek! Trek will use the data you provide to tailor your experience to
                    your preferences.
                </Text>


                <ExperienceSettingsForm/>


            </Stack>


        </>
    )
}

export default ExperienceSettingsApp;
