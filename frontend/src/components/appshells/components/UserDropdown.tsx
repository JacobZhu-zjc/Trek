import cx from 'clsx';
import {useState} from 'react';
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
import classes from './UserDropdown.module.css';
import {Link} from 'react-router-dom';
import {useAuth0} from "@auth0/auth0-react";
import {useSelector} from "react-redux";
import {User} from "@trek-types/user.ts";

interface UserDropdownProps {
    isNavbar?: boolean;
}

export function UserDropdown({isNavbar = false}: UserDropdownProps) {
    const theme = useMantineTheme();
    const [userMenuOpened, setUserMenuOpened] = useState(false);
    const {logout} = useAuth0();
    const profile = useSelector((state: { user: { self: User } }) => state.user.self);
    const imageLink = (profile.uploadedProfilePictureURL && profile.uploadedProfilePictureURL !== "") ? profile.uploadedProfilePictureURL : profile.image;


    return (<>
        <Menu
            width={260}
            position={isNavbar ? "right-end" : "bottom-end"}
            transitionProps={{transition: 'pop-top-right'}}
            trigger="click-hover"
            onClose={() => setUserMenuOpened(false)}
            onOpen={() => setUserMenuOpened(true)}
            withinPortal
        >
            <Menu.Target>
                {isNavbar ? (<UnstyledButton
                        className={cx(classes.user)}>
                        <Avatar src={imageLink} alt={profile.name}/>
                    </UnstyledButton>) :

                    (<UnstyledButton
                        className={cx(classes.user, {[classes.userActive]: userMenuOpened})}>
                        <Group gap={7}>
                            <Avatar src={imageLink} alt={profile.name} radius="xl" size={30}/>
                            <Text fw={500} size="sm" lh={1} mr={3} className='hidden md:block'>
                                {profile.name}
                            </Text>
                            <IconChevronDown style={{width: rem(12), height: rem(12)}} stroke={1.5}/>
                        </Group>
                    </UnstyledButton>)
                }


            </Menu.Target>
            <Menu.Dropdown style={{'border-radius': '20px'}}>
                <Link to="/profile">
                    <Menu.Item
                        leftSection={
                            <IconUserCircle
                                style={{width: rem(16), height: rem(16)}}
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
                            <IconUser style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                        }
                    >
                        Profile Settings
                    </Menu.Item>
                </Link>
                <Link to="/settings/account">
                    <Menu.Item
                        leftSection={
                            <IconSettings style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                        }
                    >

                        Account Settings
                    </Menu.Item>
                </Link>

                <Menu.Divider/>

                <Menu.Item
                    leftSection={
                        <IconLogout style={{width: rem(16), height: rem(16)}} stroke={1.5}/>
                    }
                    onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}
                >
                    Logout
                </Menu.Item>
            </Menu.Dropdown>
        </Menu></>);
}
