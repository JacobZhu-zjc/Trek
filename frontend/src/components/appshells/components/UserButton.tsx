/**
 * Source https://ui.mantine.dev/component/user-button/
 */
import {UnstyledButton, Group, Avatar, Text} from '@mantine/core';
import classes from './UserButton.module.css';
import {useSelector} from "react-redux";
import {BasicUser} from '@trek-types/user';

export function UserButton() {
    const profile = useSelector((state: { user: { self: BasicUser } }) => state.user.self);
    const imageLink = (profile.uploadedProfilePictureURL && profile.uploadedProfilePictureURL !== "") ? profile.uploadedProfilePictureURL : profile.image;

    return (
        <UnstyledButton className={classes.user}>
            <Group>
                <Avatar
                    src={imageLink}
                    radius="xl"
                />

                <div style={{flex: 1}}>
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
