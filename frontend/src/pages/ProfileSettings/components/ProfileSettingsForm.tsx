import {Button, Container, Group, TagsInput, Textarea, TextInput, Title} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useDispatch, useSelector} from "react-redux";
import {State} from "../../../../Interfaces.ts";
import {
    addProfileBio,
    addProfileCurrentLocation,
    addProfileHome, addProfileInterest,
    addProfileName,
    addProfileSocialAccount,
    SocialMediaAccounts
} from "../../../redux/actions/actions.ts";
import {useState} from "react";


const ProfileSettingsForm = () => {
    const profile = useSelector((state: State) => state.profile);
    const [interests, setInterests] = useState(profile.profileInterests);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: profile.profileName,
            bio: profile.profileBio,
            home: profile.profileHome,
            currentlyAt: profile.profileCurrentLocation,
            facebook: profile.socialAccounts.Facebook,
            instagram: profile.socialAccounts.Instagram,
            twitter: profile.socialAccounts.Twitter,
            youtube: profile.socialAccounts.Youtube,
        },
    });

    const dispatch = useDispatch();

    function handleSubmit(values: {name: string, home: string, currentlyAt: string, bio: string, facebook: string, twitter: string, youtube: string, instagram: string}) {
        dispatch(addProfileName(values.name));
        dispatch(addProfileHome(values.home));
        dispatch(addProfileCurrentLocation(values.currentlyAt));
        dispatch(addProfileBio(values.bio));
        dispatch(addProfileSocialAccount(SocialMediaAccounts.Facebook, values.facebook));
        dispatch(addProfileSocialAccount(SocialMediaAccounts.Twitter, values.twitter));
        dispatch(addProfileSocialAccount(SocialMediaAccounts.Youtube, values.youtube));
        dispatch(addProfileSocialAccount(SocialMediaAccounts.Instagram, values.instagram));
        dispatch(addProfileInterest(interests));
    }

    return (
        <>
            <form onSubmit={form.onSubmit((values) => handleSubmit(values))}>

                <Container px={0} mb={'50px'} mr={'50px'}>
                    <Title order={4} mb={'15px'}>Basic Information</Title>

                    <TextInput
                        label="Name"
                        placeholder="Your beautiful name"
                        key={form.key('name')}
                        {...form.getInputProps('name')}
                    />

                    <TextInput
                        label="Home"
                        placeholder="Alabama, USA"
                        key={form.key('home')}
                        {...form.getInputProps('home')}
                    />

                    <TextInput
                        label="Currently At"
                        placeholder="Far Far Away"
                        key={form.key('currentlyAt')}
                        {...form.getInputProps('currentlyAt')}
                    />

                    <Textarea
                        label="Bio"
                        key={form.key('bio')}
                        {...form.getInputProps('bio')}
                        placeholder="Tell us a little about yourself"
                    />

                    <TagsInput
                        label="Interests"
                        description="This is only used to show your interests to other users."
                        placeholder="Add your travel preferences"
                        data={['Island', 'BC', 'Ocean', 'Mountains', 'Hiking', 'Recursion', 'Cities', 'Desert']}
                        value={interests}
                        onChange={(newInterests) => setInterests(newInterests)}
                    />
                </Container>

                <Container px={0} mb={'50px'}>
                    <Title order={4} mb={'15px'}>Link Social Accounts</Title>
                    <TextInput
                        label="Facebook"
                        placeholder="facebook.com/username"
                        key={form.key('facebook')}
                        {...form.getInputProps('facebook')}
                    />
                    <TextInput
                        label="Instagram"
                        placeholder="instagram.com/username"
                        key={form.key('instagram')}
                        {...form.getInputProps('instagram')}
                    />
                    <TextInput
                        label="Twitter"
                        placeholder="twitter.com/username"
                        key={form.key('twitter')}
                        {...form.getInputProps('twitter')}
                    />
                    <TextInput
                        label="YouTube"
                        placeholder="youtube.com/username"
                        key={form.key('youtube')}
                        {...form.getInputProps('youtube')}
                    />

                </Container>



                <Group justify="flex-end" mt="md">
                    <Button type="submit">Submit</Button>
                </Group>
            </form>



        </>
    )
}


export default ProfileSettingsForm;
