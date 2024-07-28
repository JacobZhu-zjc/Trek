import { Container } from "@mantine/core"
const ItineraryArea = () => {


    return (
        <Container p={0} pt={15} h={""} style={{ overflow: "hidden" }}>


            {/* <Droppable droppableId="timeline" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        <Draggable key={1} index={1} draggableId={"1"}>

                            <DestinationTripItemCard />
                        </Draggable>

                        {provided.placeholder}
                    </div>
                )}
            </Droppable> */}

        </Container>
    )
}

export default ItineraryArea