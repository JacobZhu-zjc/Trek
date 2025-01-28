import {useEffect, useState} from 'react';
import {
    AppShell,
    Text,
    ScrollArea,
    rem,
    Tooltip,
    UnstyledButton,
    Stack,
    Center,
    Box,
    Burger,
    Group,
    Image,
    useMantineTheme,
    LoadingOverlay
} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {IconChecklist, IconSettings, IconMap, IconClock, IconHome2} from '@tabler/icons-react';
import mobileClasses from './NavbarSimple.module.css';
import {Link, useLocation} from 'react-router-dom';
import {UserDropdown} from './components/UserDropdown';
import TrekLogo from '@assets/Trek-Dark.svg';
import {useParams} from 'react-router-dom';
import {useAuth0} from "@auth0/auth0-react";
import LoginButton from "../LoginButton";
import {useGetTripQuery} from '../../redux/services/tripApi';
import {Navigate} from 'react-router-dom';
import {SpaceProvider} from "@ably/spaces/react";
import TripOutletWrapper from "@components/appshells/components/TripOutletWrapper.tsx";


const TripAppShell = () => {
    const [opened, {toggle}] = useDisclosure();
    const [active, setActive] = useState(0);
    const theme = useMantineTheme();
    const isSm = useMediaQuery(`(max-width: ${theme.breakpoints.sm})`);
    const {uuid} = useParams() as { uuid: string } || '';
    const {loginWithRedirect} = useAuth0();
    const {isAuthenticated: auth} = useAuth0();
    const {data: trip, isLoading, error: tripError} = useGetTripQuery(uuid);
    const location = useLocation();

    const spaceName = useParams().uuid ?? 'eef';

    const data = [
        {link: `/trip/${uuid}/overview`, label: 'Overview', icon: IconChecklist},
        {link: `/trip/${uuid}/map`, label: 'Map', icon: IconMap},
        {link: `/trip/${uuid}/timeline`, label: 'Timeline', icon: IconClock},
        {link: `/trip/${uuid}/settings`, label: 'Settings', icon: IconSettings},
    ];

    useEffect(() => {
        const path = location.pathname;
        const index = data.findIndex(navbarLink => path.includes(navbarLink.link));
        if (index !== -1) {
            setActive(index);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.pathname]);


    /**
     * TripAppShell component navigates to 401 if loggined user is not authorized
     * TripAppShell component redirects to login if non-loggined user tries to access a private page
     */
    if (tripError && (('status' in tripError && tripError.status === 401) || ('originalStatus' in tripError && tripError.originalStatus === 401))) {
        if (auth) {
            console.log("Unauthorized: " + auth);
            return <Navigate to="/unauthorized"/>;
        } else {
            loginWithRedirect({
                appState: {
                    returnTo: window.location.pathname
                }
            });
        }
    } else if (tripError) {
        // throw a runtime error if the error is not 401
        throw tripError;
    }

    interface NavbarLinkProps {
        icon: typeof IconHome2;
        link: string;
        label: string;
        active?: boolean;

        onClick?(): void;
    }

    function NavbarLink({icon: Icon, link, label, active, onClick}: NavbarLinkProps) {
        return (
            <Center>
                <Link to={link}>
                    <Tooltip label={label} position="right" transitionProps={{duration: 0}}>
                        <UnstyledButton onClick={onClick} data-active={active || undefined}>
                            <Icon
                                stroke={!active ? 1 : 2}/>
                        </UnstyledButton>
                    </Tooltip>
                </Link>
            </Center>
        );
    }


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
            <item.icon className={mobileClasses.linkIcon} stroke={1.5}/>
            <Text size='xl'>{item.label}</Text>
        </Link>
    ));


    return (
        <SpaceProvider name={spaceName}>
            <AppShell
                header={{height: rem(60), offset: isSm}}
                navbar={{width: rem(80), breakpoint: 'sm', collapsed: {mobile: !opened}}}
            >
                <Box pos="relative">
                    <LoadingOverlay visible={isLoading || !trip} zIndex={1000} overlayProps={{radius: "sm", blur: 2}}/>
                    {(!isLoading && trip) ? <>
                        <AppShell.Header hiddenFrom='sm'>
                            <Group justify="space-between" h="100%">
                                <Group h="100%" px="md">
                                    <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm"/>
                                    <Link to="/">
                                        <Image src={TrekLogo} h="50%"/>
                                    </Link>
                                </Group>
                                <Group>
                                    {auth ? <UserDropdown/> :
                                        (<div className="pr-4">
                                            <LoginButton/>
                                        </div>)}
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

                            <AppShell.Section visibleFrom='sm' p={10}>

                                <Center>
                                    <UserDropdown isNavbar/>
                                </Center>

                            </AppShell.Section>
                        </AppShell.Navbar>

                        <AppShell.Main>
                            {/*<Outlet />*/}
                            <TripOutletWrapper tripError={tripError}/>
                        </AppShell.Main>
                    </> : <Box h={"100vh"}></Box>}
                </Box>
            </AppShell>
        </SpaceProvider>
    );
}

export default TripAppShell;
