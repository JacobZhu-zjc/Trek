import {Box, Text, Timeline} from "@mantine/core";
import classes from "./Overview.module.css"
import {IconMapPin} from "@tabler/icons-react";

// React element for the information panel displaying summary data of the trip
const InformationPanel = (): JSX.Element => {
    return (
        <Box className={classes.spacer}>
            <Box className={classes.leftBox}>
                <DescriptionSection/>
                <LocationsSection/>
            </Box>

            <Box className={classes.rightBox}>
                <PeopleSection/>
                <BudgetSection/>
            </Box>
        </Box>
    );
}

// React component for displaying the trip name, dates, and description
const DescriptionSection = (): JSX.Element => {
    return (
        <>
            <h2 className={classes.title}>My Awesome Trip to BC!</h2>
            <span className={classes.subtitle}>Jul. 15 - Jul. 20</span>
            <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
            </p>
        </>
    );
}

// React component for displaying the destinations for the trip, using a Mantine Timeline
const LocationsSection = (): JSX.Element => {
    return (
        <>
            <h2 className={classes.title}>Locations</h2>
            <Timeline bulletSize={24} lineWidth={2} className={classes.timeline}>
                <Timeline.Item bullet={<IconMapPin size={12}/>} lineVariant="dashed">
                    <Text c="dimmed" size="sm">Capilano Suspension Bridge - a simple suspension bridge crossing the
                        Capilano River in Upper Capilano, BC</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconMapPin size={12}/>} lineVariant="dashed">
                    <Text c="dimmed" size="sm">Lake Louise - a glacial lake within Banff National Park in Alberta,
                        Canada</Text>
                </Timeline.Item>

                <Timeline.Item bullet={<IconMapPin size={12}/>} lineVariant="dashed">
                    <Text c="dimmed" size="sm">Banff - a resort town in the province of Alberta, located within Banff
                        National Park</Text>
                </Timeline.Item>
            </Timeline>
        </>
    );
}

// React component for displaying a list of people going on the trip
const PeopleSection = (): JSX.Element => {
    return (
        <>
            <h2 className={classes.title}>People</h2>
            <Box className={classes.profileContainer}>
                <Box className={classes.profileBanner}>
                    <img
                        src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z"/>
                    <p>
                        Gregor Kiczales <br/>
                        gregor@cs.ubc.ca
                    </p>
                </Box>
                <Box className={classes.profileBanner}>
                    <img
                        src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z"/>
                    <p>
                        Gregor Kiczales <br/>
                        gregor@cs.ubc.ca
                    </p>
                </Box>
            </Box>
        </>
    );
}

// React component for displaying the budget information about the trip
const BudgetSection = (): JSX.Element => {
    return (
        <>
            <h2 className={classes.title}>Budget</h2>
            <Box>
                <div className={classes.budgetAligner}>
                    <Text size="md" className={classes.budget}>Total:</Text><br/>
                    <Text size="md" className={classes.budget}>Individual:</Text>
                </div>
                <div className={classes.budgetAligner}>
                    <Text size="md" className={classes.budget}>$2400</Text><br/>
                    <Text size="md" className={classes.budget}>$1200</Text>
                </div>
            </Box>
        </>
    );
}

export default InformationPanel;
