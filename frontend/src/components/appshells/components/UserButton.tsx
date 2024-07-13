/**
 * Source https://ui.mantine.dev/component/user-button/
 */
import { UnstyledButton, Group, Avatar, Text } from '@mantine/core';
import classes from './UserButton.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getAuthdUserAsync} from "../../../redux/users/thunks.ts";
import {AppDispatch} from '../../../redux/store.ts';

interface user {
    name: string,
    email: string,
    image: {
        picture: string,
    }
}

export function UserButton() {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getAuthdUserAsync());
    }, []);

    const profile = useSelector((state: {user: {self: user}}) => state.user.self);
    // console.log(profile);
    return (
        <UnstyledButton className={classes.user}>
            <Group>
                <Avatar
                    src={profile.image && profile.image.picture}
                    radius="xl"
                />

                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        {profile.name}
                    </Text>

                    <Text c="dimmed" size="xs">
                        {profile.email}
                    </Text>
                </div>

            </Group>
        </UnstyledButton>
    );
}

export default UserButton;
