import {useContext, useEffect, useRef, useState} from "react";
import {AspectRatio, Box, Button, Grid, Image, Paper, ScrollArea, Spoiler, Text, Timeline, Title} from "@mantine/core";
import {Carousel} from "@mantine/carousel";
import classes from "./Overview.module.css"
import {IconMapPin, IconMapPinFilled, IconReplace} from "@tabler/icons-react";
import Autoplay from 'embla-carousel-autoplay';
import StartAreaCard from "../../components/cards/area-card/StartAreaCard.tsx";
import CostChart, {CostChartProps} from "./components/budget/CostChart";
import PaymentChart from "./components/budget/PaymentChart";
import TripCover from "./components/TripCover";
import {useDispatch, useSelector} from "react-redux";
import {BarChart} from '@mantine/charts';
import {BasicUser} from "@trek-types/user.ts";
import ReconcilePaymentModal from "./components/budget/ReconcilePaymentModal.tsx";
import {useDisclosure} from "@mantine/hooks";
import {getTripAsync} from "../../redux/trips/thunks.ts";
import {AppDispatch} from "../../redux/store.ts";
import {Trip} from "@trek-types/trip.ts";
import {UserContext} from "../../App.tsx";
import {useParams} from "react-router-dom";
import MapboxTripMap from "../TripMap/components/MapboxTripMap.tsx";
import DestinationCard from "@components/cards/destination-card/DestinationCard.tsx";
import {Marker} from "mapbox-gl";
import {Destination, SimpleDestination} from "@trek-types/destination.ts";

const TripOverviewApp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const userContext = useContext(UserContext);
    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);
    const tripUUID = useParams().uuid as string;


    /** Set Page Title To "Trip Overview" */
    useEffect(() => {
        document.title = "Trip Overview";
    }, []);

    useEffect(() => {
        if (trip && trip._id === tripUUID) {
            return;
        }
        dispatch(getTripAsync({uuid: tripUUID, token: userContext.token}));
    }, [userContext.token, dispatch, trip, tripUUID]);

    const tripMembers: BasicUser[] = (trip?.nonOwnerUsers) ? trip.nonOwnerUsers : [];
    const [modalOpened, {open: modalOpen, close: modalClose}] = useDisclosure(false);
    const autoplay = useRef(Autoplay({delay: 2000}));
    const [areas, setAreas] = useState<SimpleDestination[]>(trip.destObjs);
    const [markers, setMarkers] = useState<Array<{ marker: Marker, key: string }>>([]);

    useEffect(() => {
        setAreas(trip.destObjs);
    }, [trip.destObjs]);

    useEffect(() => {
        const tempMarkers = [];
        const start = trip.startObj;
        if (start && start.geometry) {
            tempMarkers.push({
                marker: new Marker().setLngLat(start.geometry),
                key: "" // not needed for this page
            });
        }
        for (const destObj of trip.destObjs ?? []) {
            if (destObj.geometry) {
                tempMarkers.push({
                    marker: new Marker().setLngLat(destObj.geometry),
                    key: "" // not needed for this page
                })
            }
        }
        setMarkers(tempMarkers);
    }, [trip]);


    if (trip) {
        const costChartData: CostChartProps = {
            chartName: "Trip Cost",
            legendTitle: "Trip Cost (including estimated)",
            currency: trip.budget.baseCurrency,
            data: trip.budget.tripBudgetCategoriesGroupCost && trip.budget.tripBudgetCategoriesGroupCost.map(item => ({
                name: item.category,
                value: item.value
            }))
        };

        const slides = trip.photoURLs && trip.photoURLs.map((photoURL, index) => (
            <Carousel.Slide key={index}>
                <AspectRatio ratio={1080 / 720} w={"100%"} mx="auto">
                    <Image src={photoURL}/>
                </AspectRatio>
            </Carousel.Slide>
        ));

        const areaCards = areas && areas.map((area, index) => (
            <Timeline.Item key={index} bullet={<IconMapPin size={20}/>} lineVariant="dashed">
                {/* <AreaCard area={area} /> */}
                <DestinationCard destination={{
                    ...area,
                    _id: area.id,
                    geometry: {type: "Point", coordinates: area.geometry ?? [-123.113952, 49.2608724]}
                }}/>
            </Timeline.Item>
        ));

        return (
            <>
                <Grid m={0} p={0} align="stretch">
                    <Grid.Col span={{base: 12, md: 6, lg: 6}}>
                        <Paper shadow="xl" radius={0} h={"100%"} withBorder p={0}>

                            <TripCover
                                tripName={trip.name}
                                tripOwner={typeof trip.owner === 'string' ? trip.owner : trip.owner.sub}
                                tripMembers={trip.nonOwnerUsers ? trip.nonOwnerUsers : [trip.ownerUser]}
                                photoUrl={trip.mainImageURL}/>

                            <Box pt={20} px={30}>
                                <Spoiler maxHeight={60} showLabel="Show more" hideLabel="Hide">
                                    <Text mt={10} size="md">
                                        {trip.desc}
                                    </Text>
                                </Spoiler>
                            </Box>

                            {trip.budget.tripTotalGroupCost !== 0 && (<>
                                <Box pt={20} px={30}>
                                    <Title order={3} pb={10}>Trip Budget</Title>

                                    <CostChart {...costChartData} />
                                    <PaymentChart
                                        currency="CAD"
                                        data={[
                                            {name: 'Paid', value: trip.budget.tripTotalPayments},
                                            {
                                                name: 'Unpaid',
                                                value: trip.budget.tripTotalGroupCost - trip.budget.tripTotalPayments
                                            },
                                        ]}
                                    />
                                </Box>

                                <Box pt={20} px={30}>
                                    <Title order={5} mb={5}>Paid Costs By Member</Title>
                                    <BarChart
                                        h={75 * trip.budget.tripMemberSummary.length}
                                        w={"100%"}
                                        data={trip.budget.tripMemberSummary.map((member) => ({
                                            member: tripMembers.find((tripMember: BasicUser) => (tripMember.sub === member.member))?.name,
                                            remaining: member.totalCost - member.totalPayment,
                                            totalPayment: member.totalPayment
                                        }))}
                                        dataKey="member"
                                        orientation="vertical"
                                        yAxisProps={{width: 80}}
                                        xAxisProps={{width: 30}}
                                        barProps={{radius: 0}}
                                        type="stacked"
                                        series={[
                                            {name: 'totalPayment', color: '#0CAF49', label: "Total Payment"},
                                            {name: 'remaining', color: 'gray.6', label: 'Remaining Costs'},

                                        ]}
                                        gridAxis="none"
                                    />

                                    <ReconcilePaymentModal tripMemberSummary={trip.budget.tripMemberSummary}
                                                           opened={modalOpened} close={modalClose}/>

                                    <Button
                                        mt={20}
                                        rightSection={<IconReplace size={16}/>}
                                        variant="gradient"
                                        gradient={{from: 'teal', to: 'lime', deg: 90}}
                                        onClick={() => {
                                            modalOpen()
                                        }}
                                    >
                                        Reconcile Payments
                                    </Button>
                                </Box>
                            </>)
                            }

                            {trip.photoURLs && trip.photoURLs.length !== 0 &&
                                (<Box pt={20} px={30}>
                                    <Title order={3} pb={10}>Photos</Title>

                                    <Carousel
                                        withIndicators
                                        slideSize={{base: '100%', sm: '50%', md: '33.333333%'}}
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

                    <Grid.Col span={"auto"} p={0} h={"100vh"}>
                        <Box w={"100%"} h={"400px"}>
                            <MapboxTripMap markers={markers} callback={() => ""}/>
                        </Box>

                        <Box pt={20} px={30} pb={30}>
                            <Title order={3}>Trip Locations</Title>

                            <ScrollArea.Autosize mah={700} scrollbars="y" mx="auto">


                                <Timeline bulletSize={36} lineWidth={2} className={classes.timeline}>

                                    <Timeline.Item bullet={<IconMapPinFilled size={20}/>} lineVariant="dashed">
                                        <StartAreaCard dest={trip.startObj as unknown as Destination}/>
                                    </Timeline.Item>

                                    {areaCards}

                                </Timeline>
                            </ScrollArea.Autosize>
                        </Box>


                    </Grid.Col>
                </Grid>

            </>
        );

    } else {
        console.log("Trip does not exist");
    }

}

export default TripOverviewApp;
