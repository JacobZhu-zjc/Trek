/**
 * Source https://ui.mantine.dev/component/user-button/
 */
import { UnstyledButton, Group, Avatar, Text } from '@mantine/core';
import classes from './UserButton.module.css';
import {useSelector} from "react-redux";

interface user {
    name: string,
    email: string,
    image: string,
}

export function UserButton() {
    // const dispatch = useDispatch<AppDispatch>();
    // useEffect(() => {
    //     dispatch(getAuthdUserAsync());
    // }, []);

    const profile = useSelector((state: {user: {self: user}}) => state.user.self);
    // console.log(profile);
    return (
        <UnstyledButton className={classes.user}>
            <Group>
                <Avatar
                    src={profile.image}
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
