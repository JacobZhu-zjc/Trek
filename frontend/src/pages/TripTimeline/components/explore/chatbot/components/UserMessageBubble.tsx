import { Box, Text } from "@mantine/core";
import React from "react";


const UserMessageBubble = ({ message }: { message: string }) => {

    const messageWithLineBreaks = message.split("\\n").map((part, index, array) => (
        <React.Fragment key={index}>
            {part}
            {index < array.length - 1 && <br />}
        </React.Fragment>
    ));

    return (
        <Box p="md">
            <Text size="sm" mb={5}>You:</Text>
            <Text>{messageWithLineBreaks}</Text>
        </Box>
    );

}

export default UserMessageBubble;