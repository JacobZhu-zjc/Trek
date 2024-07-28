import { Box, Button, List, TextInput } from "@mantine/core";
import classes from "./Forms.module.css";
import {useDispatch, useSelector} from "react-redux";
import {useContext, useEffect, useState} from "react";
import {getTripAsync, putTripAsync} from "../../redux/trips/thunks.ts";
import {Trip} from "@trek-types/trip.ts";
import {AppDispatch} from "../../redux/store.ts";
import { UserContext } from "../../App.tsx";
import { useAuth0 } from "@auth0/auth0-react";
import { useParams } from "react-router-dom";

// React component for listing all the people already in the trip, and for adding more if necessary
const TodoForm = (): JSX.Element => {
    const tripUUID = useParams().uuid as string;
    const dispatch = useDispatch<AppDispatch>();
    const userContext = useContext(UserContext);
    const { isAuthenticated } = useAuth0();
    const token = userContext.token;

    useEffect(() => {
      if (isAuthenticated) {
        dispatch(getTripAsync({ uuid: tripUUID, token: userContext.token }));
      }
    }, []);

    const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);
    void trip; // TODO delete
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
        dispatch(putTripAsync({uuid:trip._id, token: token, trip:{...trip, todo:newTodo}}));
    }
    function handleDelete(i: number) {
        const newTodo = todo.filter((_, index) => {
            return index !== i
        });
        setTodo(newTodo);
        dispatch(putTripAsync({uuid:trip._id, token: token, trip:{...trip, todo:newTodo}}));
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
