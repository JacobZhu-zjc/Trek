import {Button, Center, Container, Flex, Pagination} from "@mantine/core";
import AltTripCard from "../../../components/AltTripCard";
import {Link, useLocation} from "react-router-dom";
import {useContext, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {getTripsPaginatedAsync} from "../../../redux/trips/thunks";
import {useAuth0} from "@auth0/auth0-react";
import {AppDispatch} from "../../../redux/store";
import {getAuthdUserAsync} from "../../../redux/users/thunks.ts";
import {UserContext} from "../../../App.tsx";
import {State} from "@trek-types/redux.ts";
import {resetStatus} from "../../../redux/trips/reducers.ts";
import {Notifications} from "@mantine/notifications";
import {useMediaQuery} from "@mantine/hooks";

let attempts = 0;

const PaginatedTrips = () => {
    const [tripCards, setTripCards] = useState<JSX.Element[]>([]);
    let altTrips: JSX.Element[] = [];
    const dispatch = useDispatch<AppDispatch>();
    const basicUUIDS = useSelector((state: State) => state.trip.basicUUIDS);
    const totalPages = useSelector((state: State) => state.trip.totalPages);
    const [activePage, setPage] = useState(0);
    const {user, isAuthenticated} = useAuth0();
    const userContext = useContext(UserContext);
    const status = useSelector((state: { trip: { status: string } }) => state.trip.status);
    const location = useLocation();
    const isPhoneScreen = useMediaQuery('(max-width: 600px)');

    useEffect(() => {
        attempts = 0;
        dispatch(resetStatus());
    }, [location, dispatch, activePage]);

    useEffect(() => {
        (async () => {
            const token = userContext.token;
            const subtoken = userContext.subtoken;
            const name = user?.name ?? "";
            const email = user?.email ?? "";
            const picture = user?.picture ?? "";

            if (isAuthenticated && attempts < 10) {
                attempts++;
                dispatch(getAuthdUserAsync({token, subtoken, name, email, picture}));

                if (user?.sub && status != "fulfilled" && attempts < 10) {
                    attempts++;
                    dispatch(getTripsPaginatedAsync({"token": token, "pageNum": activePage}));
                }
            }
            if (basicUUIDS) {
                altTrips = [];
                for (const trip of basicUUIDS) {
                    altTrips.push(<AltTripCard uuid={trip}/>)
                }
                setTripCards(altTrips);
            }
        })();
    }, [basicUUIDS, userContext, status, dispatch, isAuthenticated, activePage]);

    return (
        <>
            <Notifications limit={1}/>
            <Container mt={100}>
                <Flex justify="flex-end" mb={10}>
                    <Link to={"/create-trip"}>
                        <Button variant="filled" color="green" radius="xl">+ Add Trip</Button>
                    </Link>
                </Flex>
                <Flex
                    gap="sm"
                    justify={isPhoneScreen ? "center" : "flex-start"}
                    align="flex-start"
                    direction="row"
                    wrap="wrap"
                    maw={"100%"}
                    mb={"md"}
                >
                    {tripCards.map(altTrip => altTrip)}
                </Flex>
                <Center>
                    <Pagination total={totalPages} value={activePage + 1} onChange={value => setPage(value - 1)}
                                color="green"/>
                </Center>
            </Container>

        </>);
}

export default PaginatedTrips;
