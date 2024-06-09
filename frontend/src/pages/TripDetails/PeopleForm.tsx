import { Box, Button, Grid } from "@mantine/core";
import { IconPlus } from '@tabler/icons-react';
import classes from "./Forms.module.css";
import ProfileBanner from "./components/ProfileBanner";

// React component for listing all the people already in the trip, and for adding more if necessary
const PeopleForm = (): JSX.Element => {
    return (
        <Box className={classes.spacer}>
            <h2 className={classes.title}>People</h2>
            <Grid>
                <Grid.Col span={4}>
                    <ProfileBanner
                        imgSrc="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z"
                        username="Gregor Kiczales"
                        contact="gregor@cs.ubc.ca"
                        funfact="I enjoy teaching CPSC 110!"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <ProfileBanner
                        imgSrc="https://images.unsplash.com/photo-1608848461950-0fe51dfc41cb?q=80&w=1000&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxleHBsb3JlLWZlZWR8MXx8fGVufDB8fHx8fA%3D%3D"
                        username="Cat 1"
                        contact="cat@cs.ubc.ca"
                        funfact="I enjoy TAing CPSC 110!"
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <ProfileBanner
                        imgSrc="https://media.wired.com/photos/593230eaa312645844993603/master/w_1920,c_limit/Wombat_1.jpg"
                        username="Wombat 2"
                        contact="wombat@cs.ubc.ca"
                        funfact="I ran out of ideas... Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                    />
                </Grid.Col>
                <Grid.Col span={4}>
                    <AddIcon />
                </Grid.Col>
            </Grid>
        </Box>
    );
}

// React component for a button with an "add" symbol
const AddIcon = (): JSX.Element => {
    return (
        <Button variant="light" color="lime" fullWidth>
            <IconPlus />
        </Button>
    );
}

export default PeopleForm;
