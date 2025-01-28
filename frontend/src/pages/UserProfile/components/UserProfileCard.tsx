import {ActionIcon, Avatar, Chip, Flex, Group, Paper, rem, Text} from '@mantine/core';
import {IconBrandInstagram, IconBrandTwitter, IconBrandYoutube, IconPencil} from '@tabler/icons-react';
import {Link} from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {useContext, useEffect, useState} from "react";
import {getAuthdUserAsync} from "../../../redux/users/thunks.ts";
import {User} from "@trek-types/user.ts";
import {AppDispatch} from '../../../redux/store.ts';
import {useAuth0} from "@auth0/auth0-react";
import {UserContext} from '../../../App.tsx';

function UserProfileCard() {
    const dispatch = useDispatch<AppDispatch>();
    const {user, isAuthenticated} = useAuth0();
    const userContext = useContext(UserContext);
    const profile = useSelector((state: { user: { self: User } }) => state.user.self);
    const [twitterLink, setTwitterLink] = useState<string>("https://twitter.com/");
    const [youtubeLink, setYoutubeLink] = useState<string>("https://youtube.com/");
    const [instagramLink, setInstagramLink] = useState<string>("https://instagram.com/");
    useEffect(() => {
        (async () => {
            const token = userContext.token;
            const subtoken = userContext.subtoken;
            const name = user?.name ?? "";
            const email = user?.email ?? "";
            const picture = user?.picture ?? "";

            if (isAuthenticated) {
                dispatch(getAuthdUserAsync({token, subtoken, name, email, picture}));
            }

        })();
    }, [userContext, dispatch, isAuthenticated]);

    useEffect(() => {
        setTwitterLink(profile.links?.filter(link => link.type === "twitter")[0]?.url ?? "")
        setYoutubeLink(profile.links?.filter(link => link.type === "youtube")[0]?.url ?? "")
        setInstagramLink(profile.links?.filter(link => link.type === "instagram")[0]?.url ?? "")

    }, [profile.links])


    return (
        <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
            <Flex justify="flex-end" w="100%" gap={2}>
                <Link to="/settings/profile">
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconPencil style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                    </ActionIcon>
                </Link>
            </Flex>
            <Avatar
                src={(profile.uploadedProfilePictureURL && profile.uploadedProfilePictureURL !== "") ? profile.uploadedProfilePictureURL : profile.image}
                size={120}
                radius={120}
                mx="auto"
            />
            <Text ta="center" fz="lg" fw={500} mt="md">
                {profile.name}
            </Text>
            <Text ta="center" fz="sm">
                @{profile.username}
            </Text>

            <Text ta="center" c="dimmed" mt={10} fz="sm">
                {profile.description}
            </Text>

            <Group>
                <Text ta="center" fz="md" fw={500} mt="md">
                    Interests
                </Text>
                <Flex justify="flex-start"
                      align="flex-start"
                      direction="row"
                      wrap="wrap"
                      gap='5'>
                    {profile.interests && profile.interests.map((interest) => <Chip checked={false}
                                                                                    variant="outline">{interest}</Chip>)}
                </Flex>
            </Group>

            <Group mt="md" justify="center">
                <ActionIcon component="a" size="lg" color="gray" variant="subtle"
                            href={"https://twitter.com/" + twitterLink}>
                    <IconBrandTwitter style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                </ActionIcon>
                <ActionIcon component="a" size="lg" color="gray" variant="subtle"
                            href={"https://youtube.com/@" + youtubeLink}>
                    <IconBrandYoutube style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                </ActionIcon>
                <ActionIcon component="a" size="lg" color="gray" variant="subtle"
                            href={"https://instagram.com/" + instagramLink}>
                    <IconBrandInstagram style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                </ActionIcon>
            </Group>
        </Paper>
    );
}

export default UserProfileCard;
