import { useContext, useEffect, useRef } from "react";
import { Box, Image, Text, Title, Grid, Timeline, Spoiler, AspectRatio, Paper, ScrollArea } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import classes from "./Overview.module.css"
import { IconMapPin, IconMapPinFilled } from "@tabler/icons-react";
import Autoplay from 'embla-carousel-autoplay';
import StartAreaCard from "../../components/cards/area-card/StartAreaCard.tsx";
import AreaCard from "../../components/cards/area-card/AreaCard.tsx";
import CostChart, { CostChartProps } from "./components/budget/CostChart";
import PaymentChart from "./components/budget/PaymentChart";
import TripCover from "./components/TripCover";
import {useDispatch, useSelector} from "react-redux";
import {getTripAsync, populateTripUsersAsync} from "../../redux/trips/thunks.ts";
import {State} from "@trek-types/redux.ts";
import {ar0, ar1, ar2} from "@trek-types/examples/destinationExamples.ts";
import {AppDispatch} from "../../redux/store.ts";
import {useParams} from "react-router-dom";
import { UserContext } from "../../App.tsx";
import { useAuth0 } from "@auth0/auth0-react";



const TripOverviewApp = () => {
    const tripUUID = useParams().uuid;
    /** Set Page Title To "Trip Overview" */
    useEffect(() => {
        document.title = "Trip Overview";
    }, []);

    const dispatch = useDispatch<AppDispatch>();
    const userContext = useContext(UserContext);
    const { isAuthenticated } = useAuth0();

    useEffect(() => {
        console.log("token is " + userContext.token);
        if (tripUUID) {
            dispatch(getTripAsync({ uuid: tripUUID, token: userContext.token }));
        }
    }, [dispatch, userContext, isAuthenticated]);


    const autoplay = useRef(Autoplay({ delay: 2000 }));

    const trip = useSelector((state: State) => state.trip.current);
    useEffect(() => {
        if (trip.members !== undefined) {
            for (const subtoken of trip.members) {
                dispatch(populateTripUsersAsync({userSub: subtoken, tripUUID: trip._id}));
            }
        }
    }, [trip.members]);
    // TODO: fetch areas from trip after destination endpoint is implemented
    const tmpAreas = [ar0, ar1, ar2];

    const costChartData: CostChartProps = {
        chartName: "Trip Cost",
        legendTitle: "Trip Cost (including estimated)",
        currency: trip.budget.baseCurrency,
        data: trip.budget.tripBudgetCategoriesGroupCost && trip.budget.tripBudgetCategoriesGroupCost.map(item => ({
            name: item.category,
            value: item.value
        }))
    };


    const slides = trip.photos && trip.photos.map((photo, index) => (
        <Carousel.Slide key={index}>
            <AspectRatio ratio={1080 / 720} w={"100%"} mx="auto">
                <Image src={photo} />
            </AspectRatio>
        </Carousel.Slide>
    ));

    const areaCards = tmpAreas && tmpAreas.map((area, index) => (
        <Timeline.Item key={index} bullet={<IconMapPin size={20} />} lineVariant="dashed">
            <AreaCard area={area} />
        </Timeline.Item>
    ));


    if(trip.owner != "") {
        return (
            <>
                <Grid m={0} p={0} align="stretch">
                    <Grid.Col span={6} p={0}>
                        <Paper shadow="xl" h={"100%"} withBorder p={0}>

                            <TripCover tripName={trip.name} tripOwner={trip.owner.sub as string} tripMembers={trip.nonOwnerUsers ? [trip.ownerUser, ...trip.nonOwnerUsers] : [trip.ownerUser]} photoUrl={trip.mainImage} />

                            <Box pt={20} px={30}>
                                <Spoiler maxHeight={60} showLabel="Show more" hideLabel="Hide">
                                    <Text mt={10} size="md">
                                        {trip.desc}
                                    </Text>
                                </Spoiler>
                            </Box>

                            <Box pt={20} px={30}>
                                <Title order={3} pb={10}>Trip Budget</Title>

                                <CostChart {...costChartData} />
                                <PaymentChart
                                    currency="CAD"
                                    data={[
                                        { name: 'Paid', value: trip.budget.tripTotalPayments },
                                        { name: 'Unpaid', value: trip.budget.tripTotalGroupCost - trip.budget.tripTotalPayments },
                                    ]}
                                />
                            </Box>

                            {trip.photos && trip.photos.length !== 0 &&
                                (<Box pt={20} px={30}>
                                    <Title order={3} pb={10}>Photos</Title>

                                    <Carousel
                                        withIndicators
                                        slideSize={{ base: '100%', sm: '50%', md: '33.333333%' }}
                                        loop
                                        align="start"
                                        plugins={[autoplay.current]}
                                        onMouseEnter={autoplay.current.stop}
                                        onMouseLeave={autoplay.current.reset}
                                    >
                                        {slides}
                                    </Carousel>
                                </Box>)}

                        </Paper>


                    </Grid.Col>

                    <Grid.Col span={"auto"} p={0}>
                        <Box w={"100%"} h={"400px"}>

                        </Box>

                        <Box pt={20} px={30} pb={30}>
                            <Title order={3}>Trip Locations</Title>

                            <ScrollArea.Autosize mah={700} scrollbars="y" mx="auto">


                                <Timeline bulletSize={36} lineWidth={2} className={classes.timeline}>

                                    <Timeline.Item bullet={<IconMapPinFilled size={20} />} lineVariant="dashed">
                                        <StartAreaCard />
                                    </Timeline.Item>

                                    {areaCards}

                                </Timeline>
                            </ScrollArea.Autosize>
                        </Box>


                    </Grid.Col>
                </Grid >

            </>
        );

    } else {
        return (
            <div className="flex h-screen items-center justify-center text-center text-7xl font-bold text-red-800">Either you are not authenticated, or this trip is private!</div>
        );
    }

}

export default TripOverviewApp;
