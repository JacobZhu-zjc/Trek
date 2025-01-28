import {AppShell, Container, Group, Image, Space} from '@mantine/core';
import {useHeadroom} from '@mantine/hooks';
import TrekLogo from '../../assets/Trek-Dark.svg';
import {Outlet} from 'react-router';
import {UserDropdown} from './components/UserDropdown.tsx';
import {Link} from 'react-router-dom';
import Footer from './components/Footer';
import {useAuth0} from "@auth0/auth0-react";
import LoginButton from "../LoginButton.tsx";

function MainAppShell() {
    const pinned = useHeadroom({fixedAt: 120});
    const {isAuthenticated, isLoading, error} = useAuth0();


    return (
        <AppShell header={{height: 60, collapsed: !pinned, offset: true}} withBorder={false}>
            <AppShell.Header>
                <Group justify="space-between" h="100%">
                    <Group h="100%" px="md">
                        <Link to="/">
                            <Container h={"100%"}>
                                <Image src={TrekLogo} h="50%"/>
                            </Container>
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

            <AppShell.Main>
                <Outlet/>

                <Space h="xl"/>
                <Footer/>
            </AppShell.Main>

        </AppShell>
    );
}

export default MainAppShell;
