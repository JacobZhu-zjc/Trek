import { useState } from 'react';
import { AppShell, Burger, Group, ScrollArea, Image } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import TrekLogo from '../../assets/Trek.svg';
import { IconChecklist, IconLogout, IconPencil, IconMap, IconClock } from '@tabler/icons-react';
import classes from './NavbarSimple.module.css';
import { Outlet, Link } from 'react-router-dom';
import { HeaderUserDropdown } from './components/HeaderUserDropdown';


const TripAppShell = () => {
    const [opened, { toggle }] = useDisclosure();
    const [active, setActive] = useState('Billing');


    const data = [
        { link: '/trip/UUID/overview', label: 'Overview', icon: IconChecklist },
        { link: '/trip/UUID/details', label: 'Details', icon: IconPencil },
        { link: '/trip/UUID/map', label: 'Map', icon: IconMap },
        { link: '/trip/UUID/timeline', label: 'Timeline', icon: IconClock }
    ];

    const links = data.map((item) => (
        <Link
            className={classes.link}
            data-active={item.label === active || undefined}
            to={item.link}
            key={item.label}
            onClick={(_event) => {
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
                        <HeaderUserDropdown />
                    </Group>
                </Group>
            </AppShell.Header>
            <AppShell.Navbar p="md">
                {/* <AppShell.Section>
                    <Group>
                        <Avatar.Group>
                            <Avatar src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z" />
                            <Avatar src="https://www.cs.ubc.ca/~rtholmes/img/photo_2017_vsaranphotodotcom-WEB-21_square.jpg" />
                            <Avatar src="https://pwlconf.org/images/2017/ron_garcia_300.jpg" />
                            <Avatar>+5</Avatar>
                        </Avatar.Group>
                    </Group>
                </AppShell.Section> */}
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

export default TripAppShell;
