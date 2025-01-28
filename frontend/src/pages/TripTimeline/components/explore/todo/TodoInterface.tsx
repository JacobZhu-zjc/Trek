import {
    Box,
    Button,
    Card,
    Center,
    CloseButton,
    Flex,
    Group,
    Modal,
    ScrollArea,
    Stack,
    Text,
    Textarea
} from "@mantine/core";
import {Trip} from "@trek-types/trip";
import {useContext, useEffect, useRef, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {UserContext} from "../../../../../App";
import {AppDispatch} from "../../../../../redux/store";
import {getTripAsync, putTripAsync} from "../../../../../redux/trips/thunks";
import {useDisclosure} from "@mantine/hooks";


const TodoInterface = () => {


    const dispatch = useDispatch<AppDispatch>();
    const tripUUID = useParams().uuid as string;
    const userContext = useContext(UserContext);
    const token = userContext.token;
    const trip = useSelector((state: { trip: { current: Trip } }) => state.trip.current);
    const [opened, {open, close}] = useDisclosure(false);
    const tripTodo = useSelector((state: { trip: { current: Trip } }) => state.trip.current.todo);
    const [todo, setTodo] = useState(tripTodo);
    const [toAdd, setToAdd] = useState('');
    const viewport = useRef<HTMLDivElement>(null);


    useEffect(() => {
        setTodo(tripTodo);
    }, [tripTodo]);

    function handleAdd() {
        const newTodo = [...todo, toAdd];
        setTodo(newTodo);
        setToAdd('');
        dispatch(putTripAsync({uuid: trip._id, token: token, trip: {...trip, todo: newTodo}}));
        close();
    }

    function handleDelete(i: number) {
        const newTodo = todo.filter((_, index) => {
            return index !== i
        });
        setTodo(newTodo);
        dispatch(putTripAsync({uuid: trip._id, token: token, trip: {...trip, todo: newTodo}}));
    }

    /** Set Page Title To "Trip To-Do" */
    useEffect(() => {
        document.title = "Trip To-Do";
    }, []);

    useEffect(() => {
        if (trip && trip._id === tripUUID) {
            return;
        }
        dispatch(getTripAsync({uuid: tripUUID, token: token}));
    }, [dispatch, token]);


    return (<>

        <Box m={"xl"} pt={"xl"}>
            <Modal opened={opened} onClose={close} title="Add a To-Do">
                <Stack justify={"center"} align="center" w={"100%"}>
                    <Textarea
                        label="New To-Do Item"
                        placeholder="Figure out what hotels to stay at..."
                        value={toAdd}
                        onChange={(event) => setToAdd(event.currentTarget.value)}
                        w={"70%"}
                        maw={600}
                        maxRows={3}
                        minRows={3}
                        radius={15}
                        autosize/>
                    <Group justify="flex-end">
                        <Button variant="light" color="lime" onClick={handleAdd}>Add item</Button>
                    </Group>
                </Stack>
            </Modal>

            <Flex direction="column" justify={"center"} h="100%" w={"100%"} gap={0} pt={"10"} mb={0} pb={0}>
                <Group justify="center" w={"100%"}>
                    <Button onClick={open} maw={400}>Add a To-Do</Button>
                </Group>
                <ScrollArea.Autosize type="scroll" mah={'70vh'} m={0} my={20} flex={1} viewportRef={viewport}>
                    {todo && todo.map((item, index) => {
                        return (
                            <Card shadow="xl" my="xl" p="lg" key={index}>
                                <div className="flex justify-between">
                                    {item}
                                    <CloseButton onClick={() => handleDelete(index)}/>
                                </div>
                            </Card>
                        );
                    })}
                </ScrollArea.Autosize>
                {todo.length === 0 &&
                    (<Center w={"100%"} h={"100%"} mt={"xl"}>
                        <Text>No To-Do Items!</Text>
                    </Center>)}
            </Flex>
        </Box></>)
}

export default TodoInterface;
