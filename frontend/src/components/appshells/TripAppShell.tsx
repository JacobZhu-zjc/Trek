import { useState } from 'react';
import { AppShell, Text, ScrollArea, rem, Tooltip, UnstyledButton, Stack, Center, Box, Burger, Group, Image, useMantineTheme } from '@mantine/core';
import { useDisclosure, useMediaQuery, /*useMediaQuery*/ } from '@mantine/hooks';
import { IconChecklist, IconPencil, IconMap, IconClock, IconHome2 } from '@tabler/icons-react';
import mobileClasses from './NavbarSimple.module.css';
import { Outlet, Link } from 'react-router-dom';
import { UserDropdown } from './components/UserDropdown';
import TrekLogo from '@assets/Trek.svg';
import { useParams } from 'react-router-dom';
import {useAuth0} from "@auth0/auth0-react";
import LoginButton from "../LoginButton";


const TripAppShell = () => {
    const [opened, { toggle }] = useDisclosure();
    const [active, setActive] = useState(0);
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const {uuid} = useParams();
    const {isAuthenticated, isLoading, error} = useAuth0();


    interface NavbarLinkProps {
        icon: typeof IconHome2;
        link: string;
        label: string;
        active?: boolean;
        onClick?(): void;
    }

    function NavbarLink({ icon: Icon, link, label, active, onClick }: NavbarLinkProps) {
        return (
            <Center>
                <Link to={link}>
                    <Tooltip label={label} position="right" transitionProps={{ duration: 0 }}>
                        <UnstyledButton onClick={onClick} data-active={active || undefined}>
                            <Icon
                                stroke={!active ? 1 : 2} />
                        </UnstyledButton>
                    </Tooltip>
                </Link>
            </Center>
        );
    }

    const data = [
        { link: `/trip/${uuid}/overview`, label: 'Overview', icon: IconChecklist },
        { link: `/trip/${uuid}/details`, label: 'Details', icon: IconPencil },
        { link: `/trip/${uuid}/map`, label: 'Map', icon: IconMap },
        { link: `/trip/${uuid}/timeline`, label: 'Timeline', icon: IconClock }
    ];


    const links = data.map((navbarLink, index) => (
        <NavbarLink
            {...navbarLink}
            key={navbarLink.label}
            active={index === active}
            onClick={() => setActive(index)}
        />
    ));

    const mobileLinks = data.map((item, index) => (
        <Link
            className={mobileClasses.link}
            data-active={index === active || undefined}
            to={item.link}
            key={item.label}
            onClick={() => {
                setActive(index);
            }}
        >
            <item.icon className={mobileClasses.linkIcon} stroke={1.5} />
            <Text size='xl'>{item.label}</Text>
        </Link>
    ));


    return (
        <AppShell
            header={{ height: rem(60), offset: isSm }}
            navbar={{ width: rem(80), breakpoint: 'sm', collapsed: { mobile: !opened } }}
        >

            <AppShell.Header hiddenFrom='sm'>
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

            <AppShell.Navbar>
                <AppShell.Section grow my="md" p={0} component={ScrollArea}>
                    <Stack justify="center" gap={0} visibleFrom='sm'>
                        {links}
                    </Stack>
                    <Box hiddenFrom='sm'>
                        {mobileLinks}
                    </Box>
                </AppShell.Section>

                <AppShell.Section visibleFrom='sm' p={0}>

                    <Center>
                        <UserDropdown isNavbar />
                    </Center>

                </AppShell.Section>
            </AppShell.Navbar>





            <AppShell.Main>
                <Outlet />
            </AppShell.Main>
        </AppShell>
    );
}

export default TripAppShell;
