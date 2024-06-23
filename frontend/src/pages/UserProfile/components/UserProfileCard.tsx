import { Avatar, Text, Paper, ActionIcon, rem, Group, Chip, Flex } from '@mantine/core';
import { IconBrandTwitter, IconBrandYoutube, IconBrandInstagram, IconPencil, IconShare3 } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import {useSelector} from "react-redux";
import {State} from "../../../../Interfaces.ts";

function UserProfileCard() {
    const profile = useSelector((state: State) => state.profile);

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
                src={profile.profilePicture}
                size={120}
                radius={120}
                mx="auto"
            />
            <Text ta="center" fz="lg" fw={500} mt="md">
                {profile.profileName}
            </Text>
            <Text ta="center" fz="sm">
                @{profile.profileUsername}
            </Text>

            <Text ta="center" c="dimmed" mt={10} fz="sm">
                {profile.profileBio}
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
                    {profile.profileInterests.map((interest) => <Chip checked={false} variant="outline">{interest}</Chip>)}
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
