import {Button, Container, Group, TagsInput, Textarea, TextInput, Title} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getAuthdUserAsync, putUserAsync} from "../../../redux/users/thunks.ts";
import {User} from "@trek-types/user.ts";
import {AppDispatch} from '../../../redux/store.ts';
import {useAuth0} from "@auth0/auth0-react";
import Success from '@components/alerts/Success.tsx';
import Failure from '@components/alerts/Failure.tsx';

const ProfileSettingsForm = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {user, getAccessTokenSilently, isAuthenticated} = useAuth0()
    const [subtoken, setSubToken] = useState("");
    const [success, setSuccess] = useState<boolean | null>(null);
    if (user && user.sub && subtoken !== user.sub) {
        setSubToken(user?.sub);
    }

    useEffect(() => {
        try {
            (async () => {
                try {
                    if (isAuthenticated) {
                        const token = await getAccessTokenSilently();
                        const name = user?.name ?? "";
                        const email = user?.email ?? "";
                        const picture = user?.picture ?? "";
                        dispatch(getAuthdUserAsync({token, subtoken, name: name, email: email, picture: picture}));
                    }

                } catch (err) {
                    console.error("access token error occurred: " + err);
                }
            })();
        } catch (err) {
            console.error("Error occurred: " + err);
        }
    }, [dispatch, getAccessTokenSilently, subtoken]);

    const profile = useSelector((state: { user: { self: User } }) => state.user.self);
    const [interests, setInterests] = useState(profile.interests);

    const form = useForm({
        mode: 'uncontrolled',
        initialValues: {
            name: profile.name,
            bio: profile.description,
            home: profile.home,
            currentlyAt: profile.currentlyAt,
            facebook: "",
            instagram: "",
            twitter: "",
            youtube: "",
        },
    });
    useEffect(() => {
        if (profile) {
            form.setValues({
                name: profile.name ?? '',
                bio: profile.description ?? '',
                home: profile.home ?? '',
                currentlyAt: profile.currentlyAt ?? '',
                facebook: getSocialLink(profile, 'facebook') || '',
                instagram: getSocialLink(profile, 'instagram') || '',
                twitter: getSocialLink(profile, 'twitter') || '',
                youtube: getSocialLink(profile, 'youtube') || '',
            });
            setInterests(profile.interests || []);
        }
    }, [profile]); // Run this effect whenever profile changes

    function getSocialLink(profile: User | undefined, type: string): string | undefined {
        if (!profile) return undefined;
        if (!profile.links) return undefined;
        const link = profile.links.find(link => link.type === type);
        return link ? link.url : undefined;
    }

    async function handleSubmit(values: {
        name: string,
        home: string,
        currentlyAt: string,
        bio: string,
        facebook: string,
        twitter: string,
        youtube: string,
        instagram: string
    }) {
        const sub = user?.sub ?? "";
        const links = [];
        if (values.facebook.trim() !== '') links.push({type: 'facebook', url: values.facebook});
        if (values.instagram.trim() !== '') links.push({type: 'instagram', url: values.instagram});
        if (values.twitter.trim() !== '') links.push({type: 'twitter', url: values.twitter});
        if (values.youtube.trim() !== '') links.push({type: 'youtube', url: values.youtube});
        setSuccess(null);
        dispatch(putUserAsync({
            ...profile,
            sub: sub,
            name: values.name,
            home: values.home,
            currentlyAt: values.currentlyAt,
            description: values.bio,
            links: links,
            interests: interests
        })).unwrap()
            .then(() => setSuccess(true))
            .catch(() => setSuccess(false));
    }

    return (
        <>
            <form onSubmit={form.onSubmit(handleSubmit)}>

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
                        radius='lg'
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
                        label="Facebook Handle"
                        placeholder="Your Facebook Username"
                        key={form.key('facebook')}
                        {...form.getInputProps('facebook')}
                    />
                    <TextInput
                        label="Instagram Handle"
                        placeholder="Your Instagram Username"
                        key={form.key('instagram')}
                        {...form.getInputProps('instagram')}
                    />
                    <TextInput
                        label="Twitter Handle"
                        placeholder="Your Twitter Profile Name"
                        key={form.key('twitter')}
                        {...form.getInputProps('twitter')}
                    />
                    <TextInput
                        label="YouTube Handle"
                        placeholder="Your YouTube Channel Name"
                        key={form.key('youtube')}
                        {...form.getInputProps('youtube')}
                    />

                </Container>

                <Group justify="flex-end" mt="md" className="flex justify-center items-center align-center">
                    {success && <Success/>}
                    {success === false && <Failure/>}
                    <Button type="submit">Submit</Button>
                </Group>
            </form>

        </>
    )
}


export default ProfileSettingsForm;
