/**
 * Source https://ui.mantine.dev/component/user-button/
 */
import { UnstyledButton, Group, Avatar, Text } from '@mantine/core';
import classes from './UserButton.module.css';

export function UserButton() {
    return (
        <UnstyledButton className={classes.user}>
            <Group>
                <Avatar
                    src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z"
                    radius="xl"
                />

                <div style={{ flex: 1 }}>
                    <Text size="sm" fw={500}>
                        Gregor Kiczales
                    </Text>

                    <Text c="dimmed" size="xs">
                        gregor@cs.ubc.ca
                    </Text>
                </div>

            </Group>
        </UnstyledButton>
    );
}

export default UserButton;
