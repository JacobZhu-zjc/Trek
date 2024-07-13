import { Box, Button, List, TextInput } from "@mantine/core";
import classes from "./Forms.module.css";
import {useDispatch, useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {getTripAsync, putTripAsync} from "../../redux/trips/thunks.ts";
import {Trip} from "../../interfaces.ts";
import {AppDispatch} from "../../redux/store.ts";

// React component for listing all the people already in the trip, and for adding more if necessary
const TodoForm = (): JSX.Element => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getTripAsync("960e5cd5-c783-4c02-a4b4-3579a674a2d0"));
    }, []);

    const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);
    const tripTodo = useSelector((state: {trip: {current: Trip}}) => state.trip.current.todo);
    const [todo, setTodo] = useState(tripTodo);
    const [toAdd, setToAdd] = useState('');

    useEffect(() => {
        setTodo(tripTodo);
    }, [tripTodo]);

    function handleAdd() {
        const newTodo = [...todo, toAdd];
        setTodo(newTodo);
        setToAdd('');
        dispatch(putTripAsync({uuid:trip._id, trip:{...trip, todo:newTodo}}));
    }
    function handleDelete(i: number) {
        const newTodo = todo.filter((_, index) => {
            return index !== i
        });
        setTodo(newTodo);
        dispatch(putTripAsync({uuid:trip._id, trip:{...trip, todo:newTodo}}));
    }

    return (
        <Box className={classes.spacer}>
            <h2 className={classes.title}>Todo-list</h2>
            <Box style={{width: "calc(100%)"}}>
                <TextInput
                    label="Add a new attraction!"
                    placeholder="What to do?"
                    className={classes.input}
                    value={toAdd}
                    onChange={(event) => setToAdd(event.currentTarget.value)}
                    style={{display: "inline-block", width: "50%"}} />
                <Button variant="light" color="lime" onClick={handleAdd}>Add item</Button>
            </Box>
            <List type="unordered" withPadding>
                {todo && todo.map((item, index) => <List.Item key={index} onClick={() => handleDelete(index)}>{item}</List.Item>)}
            </List>
        </Box>
    );
}

export default TodoForm;
