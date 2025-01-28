import {Container} from "@mantine/core";
import MapboxMap from "@components/map/MapboxMap";

const SearchInterface = () => {
    return (
        <>

            {/** Map Area */}
            <Container pt={25} h={"100%"}>
                <MapboxMap/>
            </Container>
        </>
    )

}

export default SearchInterface;
