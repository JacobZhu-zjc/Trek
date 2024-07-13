import cx from 'clsx';
import {useEffect, useState} from 'react';
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
import {useDispatch, useSelector} from "react-redux";
import {getAuthdUserAsync} from "../../../redux/users/thunks.ts";
import { useAuth0 } from "@auth0/auth0-react";
import {AppDispatch} from '../../../redux/store.ts';

// const user = {
//     name: 'Gregor Kiczales',
//     email: 'gregor@cs.ubc.ca',
//     image: 'https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z',
// };

interface user {
    name: string,
    email: string,
    image: {
        picture: string
    }
}

export function HeaderUserDropdown() {
    const theme = useMantineTheme();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const { logout } = useAuth0();

    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        dispatch(getAuthdUserAsync());
    }, []);

    const profile = useSelector((state: {user: {self: user}}) => state.user.self);

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
                        <Avatar src={profile.image && profile.image.picture} alt={profile.name} radius="xl" size={30} />
                        <Text fw={500} size="sm" lh={1} mr={3} className='hidden md:block'>
                            {profile.name}
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
                    onClick={() => logout({ logoutParams: { returnTo: window.location.origin }})}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu></>);
}
