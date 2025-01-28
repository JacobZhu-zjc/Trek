import {Box, Flex} from "@mantine/core";
import {useEffect} from "react";
import CreateTripForm from "./components/CreateTripForm";

function CreateTripApp() {

    /** Set Page Title To "Create Trip" */
    useEffect(() => {
        document.title = "Create Trip";
    }, []);


    return (
        <>
            <Flex h={"100vh"} justify={"center"} align={"flex-start"}>
                <Box miw={300} w={"60%"} mt={50}>
                    <CreateTripForm/>
                </Box>
            </Flex>
        </>
    );
}

export default CreateTripApp;
