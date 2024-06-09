import cx from 'clsx';
import { useState } from 'react';
import {
    Avatar,
    UnstyledButton,
    Group,
    Text,
    Menu,
    rem,
    useMantineTheme,
} from '@mantine/core';
import {
    IconLogout,
    IconSettings,
    IconChevronDown,
    IconUser,
    IconUserCircle,
} from '@tabler/icons-react';
import classes from './HeaderTabs.module.css';
import { Link } from 'react-router-dom';

const user = {
    name: 'Gregor Kiczales',
    email: 'gregor@cs.ubc.ca',
    image: 'https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z',
};


export function HeaderUserDropdown() {
    const theme = useMantineTheme();
    const [userMenuOpened, setUserMenuOpened] = useState(false);



    return (<>
        <Menu
            width={260}
            position="bottom-end"
            transitionProps={{ transition: 'pop-top-right' }}
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                <UnstyledButton
                    className={cx(classes.user, { [classes.userActive]: userMenuOpened })}
                >
                    <Group gap={7}>
                        <Avatar src={user.image} alt={user.name} radius="xl" size={30} />
                        <Text fw={500} size="sm" lh={1} mr={3} className='hidden md:block'>
                            {user.name}
                        </Text>
                        <IconChevronDown style={{ width: rem(12), height: rem(12) }} stroke={1.5} />
                    </Group>
                </UnstyledButton>
            </Menu.Target>
            <Menu.Dropdown>
                <Link to="/profile">
                    <Menu.Item
                        leftSection={
                            <IconUserCircle
                                style={{ width: rem(16), height: rem(16) }}
                                color={theme.colors.green[6]}
                                stroke={1.5}
                            />
                        }
                    >

                        My Profile

                    </Menu.Item>
                </Link>

                <Menu.Label>Settings</Menu.Label>
                <Link to="/settings/profile">
                    <Menu.Item
                        leftSection={
                            <IconUser style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        }
                    >
                        Profile Settings
                    </Menu.Item>
                </Link>
                <Link to="/settings/account">
                    <Menu.Item
                        leftSection={
                            <IconSettings style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                        }
                    >

                        Account Settings
                    </Menu.Item>
                </Link>

                <Menu.Divider />

                <Menu.Item
                    leftSection={
                        <IconLogout style={{ width: rem(16), height: rem(16) }} stroke={1.5} />
                    }
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu></>);
}