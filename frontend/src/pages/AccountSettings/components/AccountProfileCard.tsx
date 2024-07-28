import { Avatar, Text, Group, Card } from '@mantine/core';
import { IconAt, IconUser } from '@tabler/icons-react';
import classes from './UserInfoIcons.module.css';
import {useSelector} from "react-redux";
import {User} from "@trek-types/user.ts";

export function AccountProfileCard() {
    // const dispatch = useDispatch<AppDispatch>();

    // useEffect(() => {
    //     dispatch(getAuthdUserAsync());
    // }, []);

    const profile = useSelector((state: {user: {self: User}}) => state.user.self);
    // console.log(profile);
    return (
        <div>
            <Card withBorder radius="md" p="xl" className={classes.card}>
                <Group wrap="nowrap">
                    <Avatar
                        src={profile.image}
                        size={120}
                        radius={120}
                        mx="auto"
                    />
                    <div>
                        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                            User Account
                        </Text>

                        <Text fz="lg" fw={500} className={classes.name}>
                            {profile.name}
                        </Text>

                        <Group wrap="nowrap" gap={10} mt={5}>
                            <IconUser stroke={1.5} size="1rem" className={classes.icon} />
                            <Text fz="xs" c="dimmed">
                                {profile.username}
                            </Text>
                        </Group>

                        <Group wrap="nowrap" gap={10} mt={3}>
                            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
                            <Text fz="xs" c="dimmed">
                                {profile.email}
                            </Text>
                        </Group>


                    </div>
                </Group>
            </Card>
        </div>
    );
}
