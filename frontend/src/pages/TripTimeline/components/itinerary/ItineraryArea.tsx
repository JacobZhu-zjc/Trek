import {Draggable, Droppable} from "@hello-pangea/dnd"
import {Box, Container, ScrollAreaAutosize, Text} from "@mantine/core"
import DestinationTripItemCard from "./cards/DestinationTripItemCard"
import classes from './DndList.module.css';
import cx from 'clsx';
import {TripItem} from "@trek-types/trip-item/tripItem";
import {Destination} from "@trek-types/destination";
import {TripItemWithDestination, useFetchMultipleDestinations} from "../../../../hooks/TripItem";
import {formatTimezoneDifference} from "@utils/tripItem";
import {useLocations, useMembers} from "@ably/spaces/react";
import {Member} from "@components/ably/utils/helpers.ts";
import {useSocket} from "../../../../hooks/UseSocket";


type UpdateLocationCallback = (location: Member["location"] | null) => void;

const ItineraryArea: React.FC = () => {


    const {itemList} = useSocket();
    const {destinationPairs} = useFetchMultipleDestinations(itemList);


    const {others, self} = useMembers();
    const {update} = useLocations();
    const renderDestinationItem = (item: TripItem, destination: Destination, previousEndTime: Date | undefined, previousTimezone: string | undefined, index: number, cardMembers: Member[]) => (
        <div key={item.key}>
            <Box w={"85%"} m={"auto"}>
                <Text ml={"xl"} size="sm">
                    {item.date?.start?.toLocaleTimeString('en-US', {
                        hour: 'numeric',
                        minute: 'numeric',
                        hour12: true,
                        timeZone: destination.properties.timezone || 'America/Vancouver'
                    })}
                    {item.date?.start &&
                        <Text span c="dimmed"
                              inherit> {formatTimezoneDifference(destination.properties.timezone, previousTimezone, item.date.start)}</Text>}</Text>

                <Draggable key={item.key} index={index} draggableId={item.key}>
                    {(provided, snapshot) => (
                        <div
                            className={`${cx(classes.item, {[classes.itemDragging]: snapshot.isDragging})} bg-slate-50`}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                        >
                            <DestinationTripItemCard
                                date={item.date}
                                destination={destination}
                                budget={item.budget}
                                previousEndTime={previousEndTime}
                                index={index}
                                self={self as Member}
                                cardMembers={cardMembers}
                                setLocation={update as UpdateLocationCallback}/>
                        </div>
                    )}
                </Draggable>
            </Box>
        </div>
    );

    // Context Preserving Accumulator
    // keep the end time of the previous destination
    let previousEndTime: Date | undefined = undefined;
    // keep the timezone of the previous destination
    let previousTimezone: string | undefined = undefined;

    const items = destinationPairs.map((pair: TripItemWithDestination, index: number) => {
        const currentItem = pair.tripItem;
        const currentStartTime = currentItem.date?.start;
        const currentEndTime = currentItem.date?.end;
        const currentTimezone = pair.destination?.properties.timezone;

        const cardMembers = others.filter(user => (user as Member).location?.index === index);

        const renderedItem = (currentItem.item_type === 'destinations' && pair.destination)
            ? renderDestinationItem(currentItem, pair.destination, previousEndTime, previousTimezone, index, cardMembers as Member[])
            : <></>;

        // Update the previous end time for the next iteration
        // if currentEndTime is undefined, set it to currentStartTime
        previousEndTime = currentEndTime || currentStartTime;
        previousTimezone = currentTimezone;

        return renderedItem;
    })


    return (
        <Container p={0} pt={15} h={"100%"}>


            <Droppable droppableId="timeline" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef} style={{height: "100%"}}>
                        <ScrollAreaAutosize scrollbars="y" p={0} m={0} h={"90%"} style={{overflowX: "hidden"}}>

                            {items}
                            {provided.placeholder}

                        </ScrollAreaAutosize>
                    </div>
                )}
            </Droppable>


        </Container>
    )
}

export default ItineraryArea
