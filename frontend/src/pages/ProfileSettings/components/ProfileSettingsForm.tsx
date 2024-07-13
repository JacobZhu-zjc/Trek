import {Button, Container, Group, TagsInput, Textarea, TextInput, Title} from '@mantine/core';
import {useForm} from '@mantine/form';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getAuthdUserAsync, putUserAsync} from "../../../redux/users/thunks.ts";
import {User} from "../../../interfaces.ts";
import {AppDispatch} from '../../../redux/store.ts';

const ProfileSettingsForm = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getAuthdUserAsync());
    }, []);

    const profile = useSelector((state: {user: {self: User}}) => state.user.self);
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
                name: profile.name || '',
                bio: profile.description || '',
                home: profile.home || '',
                currentlyAt: profile.currentlyAt || '',
                facebook: getSocialLink(profile, 'facebewk') || '',
                instagram: getSocialLink(profile, 'insta') || '',
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

    function handleSubmit(values: {name: string, home: string, currentlyAt: string, bio: string, facebook: string, twitter: string, youtube: string, instagram: string}) {
        const links = [];
        if (values.facebook.trim() !== '') links.push({ type: 'facebewk', url: values.facebook});
        if (values.instagram.trim() !== '') links.push({ type: 'insta', url: values.instagram});
        if (values.twitter.trim() !== '') links.push({ type: 'twitter', url: values.twitter});
        if (values.youtube.trim() !== '') links.push({ type: 'youtube', url: values.youtube});
        dispatch(putUserAsync({...profile, name:values.name, home:values.home, currentlyAt:values.currentlyAt, description:values.bio, links:links, interests:interests}));
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
