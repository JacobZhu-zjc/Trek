import { Avatar, Text, Paper, ActionIcon, rem, Group, Chip, Flex } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconPencil, IconShare3 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useContext} from "react";
import {getAuthdUserAsync} from "../../../redux/users/thunks.ts";
import {User} from "@trek-types/user.ts";
import {AppDispatch} from '../../../redux/store.ts';
import {useAuth0} from "@auth0/auth0-react";
import {UserContext} from '../../../App.tsx';

function UserProfileCard() {
    const dispatch = useDispatch<AppDispatch>();
    const {user, isAuthenticated} = useAuth0();
    const userContext = useContext(UserContext);
    useEffect(() => {
        console.log("authenticated: " + isAuthenticated);
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

    const profile = useSelector((state: {user: {self: User}}) => state.user.self);

    return (
        <Paper radius="md" withBorder p="lg" bg="var(--mantine-color-body)">
            <Flex justify="flex-end" w="100%" gap={2}>
                <Link to="/settings/profile">
                    <ActionIcon size="lg" color="gray" variant="subtle">
                        <IconPencil style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                    </ActionIcon>
                </Link>
                <ActionIcon size="lg" color="gray" variant="subtle">
                    <IconShare3 style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
            </Flex>
            <Avatar
                src={profile.image}
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
                    {profile.interests && profile.interests.map((interest) => <Chip checked={false} variant="outline">{interest}</Chip>)}
                </Flex>
            </Group>

            <Group mt="md" justify="center">
                <ActionIcon size="lg" color="gray" variant="subtle">
                    <IconBrandTwitter style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
                <ActionIcon size="lg" color="gray" variant="subtle">
                    <IconBrandYoutube style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
                <ActionIcon size="lg" color="gray" variant="subtle">
                    <IconBrandInstagram style={{ width: rem(18), height: rem(18) }} stroke={1.5} />
                </ActionIcon>
            </Group>
        </Paper >
    );
}

export default UserProfileCard;
