import {Card, Flex, Text} from "@mantine/core";
import {Destination} from "@trek-types/destination";


const StartAreaCard = ({dest}: { dest?: Destination }) => {
    return (
        <Card shadow="sm" padding="lg" radius="md" p={0} withBorder>

            <Flex align={"center"} p={10} px={20}>
                <Text fw={500} lineClamp={2}>
                    {dest?.properties?.display_name} (Starting Point)
                </Text>

            </Flex>
        </Card>)

}

export default StartAreaCard;
