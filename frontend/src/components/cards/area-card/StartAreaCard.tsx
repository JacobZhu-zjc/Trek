import { Card, Flex, Text } from "@mantine/core";


const StartAreaCard = () => {
    return (
        <Card shadow="sm" padding="lg" radius="md" p={0} h={50} withBorder>

            <Flex align={"center"} p={10} px={20}>
                <Text fw={500} lineClamp={2}>
                    Vancouver, BC (Starting Point)
                </Text>

            </Flex>
        </Card>)

}

export default StartAreaCard;