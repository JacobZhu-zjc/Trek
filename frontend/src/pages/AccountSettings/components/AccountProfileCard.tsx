import { Avatar, Text, Group, Card } from '@mantine/core';
import { IconAt, IconUser } from '@tabler/icons-react';
import classes from './UserInfoIcons.module.css';

export function AccountProfileCard() {
    return (
        <div>
            <Card withBorder radius="md" p="xl" className={classes.card}>
                <Group wrap="nowrap">
                    <Avatar
                        src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z"
                        size={120}
                        radius={120}
                        mx="auto"
                    />
                    <div>
                        <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                            User Account
                        </Text>

                        <Text fz="lg" fw={500} className={classes.name}>
                            Gregor Kiczales
                        </Text>

                        <Group wrap="nowrap" gap={10} mt={5}>
                            <IconUser stroke={1.5} size="1rem" className={classes.icon} />
                            <Text fz="xs" c="dimmed">
                                gregork
                            </Text>
                        </Group>

                        <Group wrap="nowrap" gap={10} mt={3}>
                            <IconAt stroke={1.5} size="1rem" className={classes.icon} />
                            <Text fz="xs" c="dimmed">
                                gregor@cs.ubc.ca
                            </Text>
                        </Group>


                    </div>
                </Group>
            </Card>
        </div>
    );
}