import { Box, Button, List, TextInput } from "@mantine/core";
import classes from "./Forms.module.css";
import {useSelector} from "react-redux";

// React component for listing all the people already in the trip, and for adding more if necessary
const TodoForm = (): JSX.Element => {
    // TODO: better way to spec type?
    const todo = useSelector((state: {trip: {tripTodoList: string[]}}) => state.trip.tripTodoList);

    return (
        <Box className={classes.spacer}>
            <h2 className={classes.title}>Todo-list</h2>
            <Box style={{width: "calc(100%)"}}>
                <TextInput label="Add a new attraction!" placeholder="What to do?" className={classes.input} style={{display: "inline-block", width: "50%"}} />
                <Button variant="light" color="lime">Add item</Button>
            </Box>
            <List type="unordered" withPadding>
                {todo.map((item) => <List.Item>{item}</List.Item>)}
            </List>
        </Box>
    );
}

export default TodoForm;
