import { Box, Button, List, TextInput } from "@mantine/core";
import classes from "./Forms.module.css";

// React component for listing all the people already in the trip, and for adding more if necessary
const TodoForm = (): JSX.Element => {
    return (
        <Box className={classes.spacer}>
            <h2 className={classes.title}>Todo-list</h2><br/>
            <TextInput label="Add a new attraction!" placeholder="What to do?" className={classes.input} style={{display: "inline-block", width: "50%"}} />
            <Button variant="light" color="lime">Add item</Button>
            <List type="unordered" withPadding>
                <List.Item>Stay at X hotel for 3 days</List.Item>
                <List.Item>Visit Y memorial and check out the gift shop</List.Item>
                <List.Item>Be present at Z during an alien invasion</List.Item>
                <List.Item>Run from said aliens</List.Item>
                <List.Item>Submit a pull request once you are done</List.Item>
            </List>
        </Box>
    );
}

export default TodoForm;
