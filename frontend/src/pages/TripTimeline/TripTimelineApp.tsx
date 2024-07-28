import { useEffect } from "react";
import { Grid, GridCol, Title, Text, Flex, rem, Button } from "@mantine/core";
import { DragDropContext, OnDragEndResponder } from "@hello-pangea/dnd";
import { IconCalendarEvent } from "@tabler/icons-react";
import ExploreArea from "./components/explore/ExploreArea";
import ItineraryArea from "./components/itinerary/ItineraryArea";
import {useAuth0} from "@auth0/auth0-react";
import {useParams} from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch} from "../../redux/store.ts";
import {getTripAsync} from "../../redux/trips/thunks.ts";
import {Trip} from "@trek-types/trip.ts";


const TripTimelineApp = () => {

  /** Set Page Title To "Trip Timeline" */
  useEffect(() => {
    document.title = "Trip Timeline";
  }, []);

  const {isAuthenticated, getAccessTokenSilently} = useAuth0();
  const tripUUID = useParams().uuid as string;
  const dispatch = useDispatch<AppDispatch>();
  const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);

  useEffect(() => {
    let token = null;
    (async () => {
      token = await getAccessTokenSilently();

    })()
    if (isAuthenticated && token) {
      dispatch(getTripAsync({uuid: tripUUID, token: token}));
    }
  }, [dispatch, isAuthenticated]);
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);


  const handleDragEnd: OnDragEndResponder = (result) => {
    const { source, destination } = result;

    // Check valid drag and drop? -> return
    // if (!destination) {
    //   console.log("1");
    //   return;
    // }

    // // If move is not re-ordering -> return
    // if (source.droppableId === destination.droppableId &&
    //   source.index === destination.index) {
    //   console.log("2");
    //   return;
    // }

    // // If move is within the suggestion list -> return
    // if (source.droppableId === destination.droppableId && source.droppableId === "suggestion") {
    //   console.log("3");
    //   return;
    // }

    // // If move is within the same list (timeline), reorder that list
    // if (source.droppableId === destination.droppableId) {
    //   console.log("4");
    //   // timeline list copied
    //   const timelineList = Array.from(timelineInterfaceData.timelineData);

    //   // re-order
    //   const [movedItem] = timelineList.splice(source.index, 1);
    //   timelineList.splice(destination.index, 0, movedItem);

    //   const newState: TimelineInterfaceData = {
    //     ...timelineInterfaceData,
    //     timelineData: timelineList,
    //   };

    //   setTimelineInterfaceData(newState);
    //   return;
    // }

    // // If move is from timeline to suggestion -> return
    // if (source.droppableId === "timeline" && destination.droppableId === "suggestion") {
    //   console.log("5");
    //   return;
    // }

    // // move is from suggestion -> timeline

    // const suggestionList = Array.from(timelineInterfaceData.suggestionData);
    // const [movedItem] = suggestionList.splice(source.index, 1);

    // const timelineList = Array.from(timelineInterfaceData.timelineData);

    // // convert DestinationSuggestionItem to DestinationItem
    // const destinationItem: DestinationItem = {
    //   id: movedItem.id,
    //   name: movedItem.name,
    //   description: movedItem.description,
    //   cost: null,
    //   startTime: null,
    //   duration: null,
    // }

    // timelineList.splice(destination.index, 0, destinationItem);

    // const newState: TimelineInterfaceData = {
    //   timelineData: timelineList,
    //   suggestionData: suggestionList
    // };

    // setTimelineInterfaceData(newState);

    // console.log("end");
    console.log("source", source);
    console.log("destination", destination);
    return;
  }

  const noVerticalScrollStyle: React.CSSProperties = {
    overflowY: 'hidden',
    overflowX: 'hidden',
  };

  if(trip.owner != "") {

    return (
        <>

          <div style={noVerticalScrollStyle}>



            <DragDropContext onDragEnd={handleDragEnd}>

              <div style={{ height: "calc(100vh)" }}>


                <Grid m={0} style={{ position: "relative", top: "0.5em" }} h={"calc(100vh)"}>

                  <Grid.Col p={0} visibleFrom="xs" span={{ base: 4, lg: 3.5, xl: 3 }} h={"calc(100vh)"}>

                    {/* <Paper shadow="xl" h={"100%"} withBorder p={0}> */}
                    <div className="w-[calc(100%)] z-30 leading-10 font-bold p-4" style={{ background: "linear-gradient(to left, #ecf5fd, #d1fae5)" }}>
                      <Flex justify={"flex-start"} align={"center"} gap="md">
                        <Title order={3} ml={10}>Trip Itinerary</Title>
                        <Button variant="transparent">
                          <IconCalendarEvent style={{ color: "grey", width: rem(20), height: rem(20) }} /> <Text ml={5} fw="700" c="dimmed" size="sm">8/7/2024</Text>
                        </Button>
                      </Flex>
                    </div>

                    <ItineraryArea />

                    {/*    </Paper> */}

                  </Grid.Col>

                  <GridCol span={"auto"} p={0} h={"100%"} bg={'#FAFAFA'} >
                    <ExploreArea />
                  </GridCol>
                </Grid>
              </div>

            </DragDropContext>


          </div>
        </>
    )
  } else {
    return (
        <div className="flex h-screen items-center justify-center text-center text-7xl font-bold text-red-800">Either
          you are not authenticated, or this trip is private!</div>
    )
  }
}

export default TripTimelineApp;
