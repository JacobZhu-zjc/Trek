import { useState } from 'react';
import { AppShell, Burger, Group, ScrollArea, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TrekLogo from '../../assets/Trek.svg';
import { IconUser, IconSparkles, IconSettings, IconLogout } from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import UserButton from './components/UserButton';
import { Outlet, Link } from 'react-router-dom';
import { UserDropdown } from './components/UserDropdown';
import LoginButton from "@components/LoginButton.tsx";
import {useAuth0} from "@auth0/auth0-react";


const SettingsAppShell = () => {
    const [opened, { toggle }] = useDisclosure();
    const [active, setActive] = useState('Billing');
    const { isAuthenticated, isLoading, error} = useAuth0();


    const data = [
        { link: '/settings/profile', label: 'Public Profile', icon: IconUser },
        { link: '/settings/experience', label: 'Experience', icon: IconSparkles },
        { link: '/settings/account', label: 'Account', icon: IconSettings }
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
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
        </Link>
    ));

    return (
        <AppShell
            header={{ height: 60 }}
            navbar={{ width: 300, breakpoint: 'sm', collapsed: { mobile: !opened } }}
        >
            <AppShell.Header>
                <Group justify="space-between" h="100%">
                    <Group h="100%" px="md">
                        <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
                        <Link to="/">
                            <Image src={TrekLogo} h="50%" />
                        </Link>
                    </Group>
                    <Group>
                        {!error && isLoading && <p>Loading...</p>}
                        {!error && !isLoading && isAuthenticated && <UserDropdown />}
                        { !error && !isLoading && !isAuthenticated &&
                            <div className="pr-4">
                                <LoginButton />
                            </div>
                        }
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                <AppShell.Section>
                    <UserButton />
                </AppShell.Section>
                <AppShell.Section grow my="md" component={ScrollArea}>
                    {links}
                </AppShell.Section>
                <AppShell.Section>
                    <div className={classes.footer}>
                        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
                            <IconLogout className={classes.linkIcon} stroke={1.5} />
                            <span>Logout</span>
                        </a>
                    </div>
                </AppShell.Section>
            </AppShell.Navbar>
            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default SettingsAppShell;
