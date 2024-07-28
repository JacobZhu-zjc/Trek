import { Container, ScrollAreaAutosize } from "@mantine/core";
import DestinationCard from "../../../../../components/cards/destination-card/DestinationCard";
import { Destination } from "@trek-types/destination";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { useListState } from "@mantine/hooks";
import { p11, p12, p13, ar1 } from "@trek-types/examples/destinationExamples";
import classes from '../DndList.module.css';
import cx from 'clsx';


const WishlistInterface = () => {

    /**
    * @todo Importing Examples - Should be Redux Store
    */
    const suggestedDestinations: Destination[] = [p11, p12, p13, ar1];
    const [state, /*handlers*/] = useListState(suggestedDestinations);

    const destinationCards = state.map((destination, index) => {
        return (
            <Draggable draggableId={destination._id} index={index} key={destination._id}>
                {(provided, snapshot) => (
                    <div
                        className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <DestinationCard destination={destination} isWishlist={true} />
                    </div>
                )}
            </Draggable>
        );
    });

    return (
        <>
            {/** Map Area */}
            <Container pt={25} h={"40%"}>
                {/* <Map
                    reuseMaps
                    mapboxAccessToken={import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}
                    initialViewState={{
                        longitude: -123.1207,
                        latitude: 49.2827,
                        zoom: 14
                    }}
                    style={{ width: "100%", height: "100%" }}
                    mapStyle="mapbox://styles/mapbox/streets-v9"
                    attributionControl={false}
                >


                    <Marker longitude={-123.1207} latitude={49.2827} anchor="bottom" >
                        <IconPin style={{ width: "30px", height: "30px" }} />
                    </Marker>
                    <AttributionControl customAttribution="Trek" />


                    <FullscreenControl />
                </Map> */}

            </Container>

            {/** Suggestion Area */}

            {/* <FilterWishlistDropdown /> */}
            <ScrollAreaAutosize mah={"60%"} px={20} pt={20}>
                <Droppable droppableId="wishlist" direction="vertical">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {destinationCards}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </ScrollAreaAutosize>
        </>
    )

}

export default WishlistInterface;