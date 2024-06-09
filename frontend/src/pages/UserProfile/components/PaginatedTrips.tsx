import { Center, Container, Flex, Pagination } from "@mantine/core";
import AltTripCard from "../../../components/AltTripCard";


const PaginatedTrips = () => {
    return (
        <>
            <Container mt={100}>
                <Flex
                    gap="sm"
                    justify="flex-start"
                    align="flex-start"
                    direction="row"
                    wrap="wrap"
                    maw={"100%"}
                    mb={"md"}
                >
                    <div style={{ maxWidth: "300px" }}>
                        <AltTripCard />
                    </div>
                    <div style={{ maxWidth: "300px" }}>
                        <AltTripCard />
                    </div>
                    <div style={{ maxWidth: "300px" }}>
                        <AltTripCard />
                    </div>
                    <div style={{ maxWidth: "300px" }}>
                        <AltTripCard />
                    </div>
                    <div style={{ maxWidth: "300px" }}>
                        <AltTripCard />
                    </div>
                    <div style={{ maxWidth: "300px" }}>
                        <AltTripCard />
                    </div>
                </Flex>
                <Center>
                    <Pagination total={10} color="green" />
                </Center>
            </Container>

        </>);
}

export default PaginatedTrips;