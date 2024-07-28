import { Container } from "@mantine/core";
import MapboxMap from "@components/map/MapboxMap";

const SearchInterface = () => {


    /**
     * @todo Importing Examples - Should be Redux Store
     */
    // const suggestedDestinations: Destination[] = [p0, p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, ar2];
    // const [state, /*handlers*/] = useListState(suggestedDestinations);

    // const destinationCards = state.map((destination, index) => {
    //     return (
    //         <Draggable draggableId={destination._id} index={index} key={destination._id}>
    //             {(provided, snapshot) => (
    //                 <div
    //                     className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
    //                     {...provided.draggableProps}
    //                     {...provided.dragHandleProps}
    //                     ref={provided.innerRef}
    //                 >
    //                     <DestinationCard destination={destination} isWishlist={false} />
    //                 </div>
    //             )}
    //         </Draggable>
    //     );
    // });



    return (
        <>

            {/** Map Area */}
            <Container pt={25} h={"100%"}>
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
                    <Geocoder
                        mapRef={mapRef}
                        onViewportChange={handleGeocoderViewportChange}
                        mapboxApiAccessToken={MAPBOX_TOKEN}
                        position="top-left"
                    />


                    <FullscreenControl />
                </Map> */}

                <MapboxMap />

            </Container>

            {/** Suggestion Area */}

            {/* <ScrollAreaAutosize mah={"40%"} px={20} pt={20}>

                {/* <Stack>
                    <DestinationTripItemCard />
                    <SuggestionItemCard destination={p0} isWishlist={false} />
                </Stack> */}

            {/*<Droppable droppableId="search" direction="vertical">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {destinationCards}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </ScrollAreaAutosize> */}
        </>
    )

}

export default SearchInterface;