import { Button, Center, Container, Flex, Pagination } from "@mantine/core";
import AltTripCard from "../../../components/AltTripCard";
import { Link, useLocation } from "react-router-dom";
import {useEffect, useState, useContext} from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTripsAsync } from "../../../redux/trips/thunks";
import { useAuth0 } from "@auth0/auth0-react";
import { AppDispatch } from "../../../redux/store";
import {getAuthdUserAsync} from "../../../redux/users/thunks.ts";
import {UserContext} from "../../../App.tsx";
import {State} from "@trek-types/redux.ts";
import {resetStatus} from "../../../redux/trips/reducers.ts";

let attempts = 0;

const PaginatedTrips = () => {
    const [tripCards, setTripCards] = useState<JSX.Element[]>([]);
    const {user, isAuthenticated} = useAuth0();
    const basicUUIDS = useSelector((state: State) => state.trip.basicUUIDS);
    console.log("trips is " + JSON.stringify(basicUUIDS));
    const dispatch = useDispatch<AppDispatch>();
    let altTrips: JSX.Element[] = [];
    const userContext = useContext(UserContext);
    const status = useSelector((state: {trip: {status: string}}) => state.trip.status);
    const location = useLocation();

    useEffect(() => {
        attempts = 0;
        dispatch(resetStatus());
    }, [location, dispatch]);

    useEffect(() => {
        console.log("authenticated: " + isAuthenticated);
            (async () => {
                // const token = await getAccessTokenSilently();
                const token = userContext.token;
                // const subtoken = user?.sub ?? "";
                const subtoken = userContext.subtoken;
                const name = user?.name ?? "";
                const email = user?.email?? "";
                const picture = user?.picture ?? "";

                if (isAuthenticated && attempts < 10) {
                  attempts++;
                  dispatch(getAuthdUserAsync({ token, subtoken, name, email, picture }));

              if (user?.sub && status != "fulfilled" && attempts < 10) {
                attempts++;
                console.log("PaginatedTrips - Subtoken: " + subtoken);
                dispatch(getTripsAsync({ token: token }));
              }
            }
            if(basicUUIDS) {
                altTrips = [];
                for (const trip of basicUUIDS) {
                    altTrips.push(<AltTripCard uuid={trip} />)
                }
                setTripCards(altTrips);
            }
        })();
    }, [basicUUIDS, userContext, status, dispatch, isAuthenticated]);

    return (
        <>
            <Container mt={100}>
                <Flex justify="flex-end" mb={10}>
                    <Link to={"/create-trip"}>
                        <Button variant="filled" color="green" radius="xl">+ Add Trip</Button>
                    </Link>
                </Flex>
                <Flex
                    gap="sm"
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    wrap="wrap"
                    maw={"100%"}
                    mb={"md"}
                >
                    <div>
                        {tripCards.map(altTrip => altTrip)}

                    </div>
                    {/* <div style={{ maxWidth: "300px" }}>
                        <AltTripCard />
                    </div> */}
                </Flex>
                <Center>
                    <Pagination total={10} color="green" />
                </Center>
            </Container>

        </>);
}

export default PaginatedTrips;
