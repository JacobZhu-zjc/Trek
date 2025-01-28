import {useContext, useEffect} from "react";
import {Grid, GridCol, Title, Flex} from "@mantine/core";
import {DragDropContext, OnDragEndResponder} from "@hello-pangea/dnd";
import ExploreArea from "./components/explore/ExploreArea";
import ItineraryArea from "./components/itinerary/ItineraryArea";
import {useSocket} from "../../hooks/UseSocket.ts";
import * as Y from 'yjs';
import {useDispatch} from "react-redux";
import {AppDispatch} from "../../redux/store.ts";
import {useAuth0} from "@auth0/auth0-react";
import {getTripAsync} from "../../redux/trips/thunks.ts";
import {useParams} from "react-router-dom";
import {UserContext} from "../../App.tsx";
import AvatarStack from "@components/ably/components/AvatarStack.tsx";


const TripTimelineApp = () => {
    const dispatch = useDispatch<AppDispatch>();
    const {isAuthenticated} = useAuth0();
    const tripUUID = useParams().uuid as string;
    const userContext = useContext(UserContext);
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(getTripAsync({uuid: tripUUID, token: userContext.token}));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /** Set Page Title To "Trip Timeline" */
    useEffect(() => {
        document.title = "Trip Timeline";
    }, []);


    const {socket, handler, yarray, ydoc} = useSocket();


    // const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    const handleDragEnd: OnDragEndResponder = (result) => {
        const {source, destination, draggableId} = result;
        if (!destination && source.droppableId === "timeline") {
            if (handler) {
                handler.remove(source.index);
            }
            yarray.delete(source.index, 1);
            if (socket) {
                socket.emit('updateList', Y.encodeStateAsUpdate(ydoc));
            }
        }

        if (!destination) {
            console.log("No destination");
            return;
        }

        // If move is not re-ordering -> return
        if (source.droppableId === destination.droppableId &&
            source.index === destination.index) {
            return;
        }

        // If move is within the same list (timeline), reorder that list
        if (source.droppableId === destination.droppableId && destination.droppableId === "timeline") {

            // optimistic update
            if (handler) {
                handler.reorder({from: source.index, to: destination.index});
            }

            // Reorder the Yjs array according to the drag-and-drop operation
            const item = yarray.get(source.index);
            yarray.delete(source.index, 1);
            yarray.insert(destination.index, [item]);

            // Emit the updated state to the server
            if (socket) {
                socket.emit('updateList', Y.encodeStateAsUpdate(ydoc));
            }

            return;
        }

        // If move is from the search interface to the timeline, add the item to the timeline
        // as a tripItem, not a destination
        if (source.droppableId === "search" && destination.droppableId === "timeline") {

            if (socket) {
                const tripCurrency = 'CAD' // trip.currency - hardcoded for now;
                socket.emit('addItem', draggableId, destination.index, tripCurrency);
            }

            return;
        }

        if (source.droppableId && destination.droppableId === "timeline") {
            if (socket) {
                const tripCurrency = 'CAD' // trip.currency - hardcoded for now;
                // deconstruct draggableId by (1) splitting it by '-' (dash)
                const destId = draggableId.split('-')[0];
                socket.emit('addItem', destId, destination.index, tripCurrency);
            }

            return;
        }

        return;
    }

    const noVerticalScrollStyle: React.CSSProperties = {
        overflowY: 'hidden',
        overflowX: 'hidden',
    };

    return (
        <>
            <div style={noVerticalScrollStyle}>
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div style={{height: "calc(100vh)"}}>
                        <Grid m={0} style={{position: "relative", top: "0.5em"}} h={"calc(100vh)"}>
                            <Grid.Col p={0} visibleFrom="xs" span={{base: 4, lg: 3.5, xl: 3}} h={"calc(100vh)"}>
                                {/* <Paper shadow="xl" h={"100%"} withBorder p={0}> */}
                                <div className="w-[calc(100%)] z-30 leading-10 font-bold p-4"
                                     style={{background: "linear-gradient(to left, #ecf5fd, #d1fae5)"}}>
                                    <Flex justify={"space-between"} align={"center"} gap="md">
                                        <Title order={3} ml={10}>Trip Itinerary</Title>
                                        <AvatarStack/>
                                    </Flex>
                                </div>
                                <ItineraryArea/>
                            </Grid.Col>
                            <GridCol span={"auto"} p={0} h={"100%"} bg={'#FAFAFA'}>
                                <ExploreArea/>
                            </GridCol>
                        </Grid>
                    </div>
                </DragDropContext>
            </div>
        </>
    )
}

export default TripTimelineApp;
