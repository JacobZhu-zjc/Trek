import {useEffect, useState} from 'react';
import {AppShell, Burger, Group, ScrollArea, Image, Box, LoadingOverlay} from '@mantine/core';
import {useDisclosure} from '@mantine/hooks';
import TrekLogo from '../../assets/Trek-Dark.svg';
import {IconUser, IconSparkles, IconSettings, IconLogout} from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import UserButton from './components/UserButton';
import {Outlet, Link} from 'react-router-dom';
import {UserDropdown} from './components/UserDropdown';
import LoginButton from "@components/LoginButton.tsx";
import {useAuth0} from "@auth0/auth0-react";


const SettingsAppShell = () => {
    const [opened, {toggle}] = useDisclosure();
    const [active, setActive] = useState('Billing');
    const {logout, isAuthenticated, isLoading, error, loginWithRedirect} = useAuth0();


    const data = [
        {link: '/settings/profile', label: 'Public Profile', icon: IconUser},
        {link: '/settings/experience', label: 'Experience', icon: IconSparkles},
        {link: '/settings/account', label: 'Account', icon: IconSettings}
    ];

    const links = data.map((item) => (
        <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            to={item.link}
            key={item.label}
            onClick={() => {
                setActive(item.label);
            }}
        >
            <item.icon className={classes.linkIcon} stroke={1.5}/>
            <span>{item.label}</span>
        </Link>
    ));

    useEffect(() => {
        if (!isAuthenticated && !isLoading) {
            loginWithRedirect({
                appState: {
                    returnTo: window.location.pathname
                }
            });
        }
    }), [isAuthenticated, isLoading, loginWithRedirect];


    return (
        <AppShell
            header={{height: 60}}
            navbar={{width: 300, breakpoint: 'sm', collapsed: {mobile: !opened}}}
        >
            <Box pos="relative">
                <LoadingOverlay visible={isLoading || !isAuthenticated} zIndex={1000}
                                overlayProps={{radius: "sm", blur: 2}}/>

                <AppShell.Header>
                    <Group justify="space-between" h="100%">
                        <Group h="100%" px="md">
                            <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                            <Link to="/">
                                <Image src={TrekLogo} h="50%"/>
                            </Link>
                        </Group>
                        <Group>
                            {!error && isLoading && <p>Loading...</p>}
                            {!error && !isLoading && isAuthenticated && <UserDropdown/>}
                            {!error && !isLoading && !isAuthenticated &&
                                <div className="pr-4">
                                    <LoginButton/>
                                </div>
                            }
                        </Group>
                    </Group>
                </AppShell.Header>
                <AppShell.Navbar p="md">
                    <AppShell.Section>
                        <UserButton/>
                    </AppShell.Section>
                    <AppShell.Section grow my="md" component={ScrollArea}>
                        {links}
                    </AppShell.Section>
                    <AppShell.Section>
                        <div className={classes.footer}>
                            <a href="#" className={classes.link}
                               onClick={() => logout({logoutParams: {returnTo: window.location.origin}})}>
                                <IconLogout className={classes.linkIcon} stroke={1.5}/>
                                <span>Logout</span>
                            </a>
                        </div>
                    </AppShell.Section>
                </AppShell.Navbar>
                <AppShell.Main>
                    {isAuthenticated && <Outlet/>}
                </AppShell.Main>
            </Box>
        </AppShell>
    );
}

export default SettingsAppShell;
