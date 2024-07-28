import {useEffect} from 'react';
import { Flex, Stack, Title } from '@mantine/core';
import ProfileCompletionCard from './components/ProfileCompletionCard';
import ProfileSettingsForm from './components/ProfileSettingsForm';
import UploadProfilePicture from './components/UploadProfilePicture';
// import { useAuth0 } from '@auth0/auth0-react';

const ProfileSettingsApp = () => {
    // const { user, isAuthenticated } = useAuth0();
    /** Set Page Title To "Profile Settings" */
    useEffect(() => {
        document.title = "Profile Settings";
      }, []);


    return (
        <> {
        // isAuthenticated && (
        //         <article className="column">
        //             <h1></h1>
        //             {user?.picture && <img src={user.picture} alt={user?.name}/>}
        //             <h2>{user?.name}</h2>
        //             <ul>
        //                 {Object.keys(user ?? {}).map((objKey, i) => <li key={i}>{objKey}: {user ? user[objKey] : ""}</li>)}
        //             </ul>
        //         </article>
        //     )
        }
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