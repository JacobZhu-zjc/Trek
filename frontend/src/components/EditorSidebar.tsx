import { useLocation, useNavigate } from 'react-router-dom'
import { Box } from '@mantine/core';
import classes from './EditorSidebar.module.css';

// Props for the EditorSidebar component
interface SidebarProps {
    showImage: boolean,
}

// React component for the sidebar used to navigate between trip editor pages (ie. Overview, Details, Map, Timeline)
const EditorSidebar = (props: SidebarProps) : JSX.Element => {
    return (
        // Pulling the corresponding styling for the class from the CSS document
        <Box className={classes.sidebarBox}>
            {props.showImage ? <img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Shuswap_Lake_from_Sorrento%2C_B.C..jpg" /> : <></>}
            {props.showImage ? <span className={classes.caption}>Schuswap Lake</span> : <></>}
            <SidebarNavigationButton destination={"overview"} />
            <SidebarNavigationButton destination={"details"} />
            <SidebarNavigationButton destination={"map"} />
            <SidebarNavigationButton destination={"timeline"} />
            <ProfileBanner />
        </Box>
    );
};

// Props for the SidebarNavigationButton component
interface NavButtonProps {
    destination: string,
}

// React component for the individual buttons used to navigate between trip editor pages
const SidebarNavigationButton = (props: NavButtonProps) : JSX.Element => {
    const destination: string = props.destination;
    // Getting the current Route from react-router-dom
    const activePage: string = useLocation().pathname.replace("/", "");
    const navigate = useNavigate();

    return (
        // Box for spacing
        <Box className={classes.sidebarButtonMargin}>
            {/* Choosing one of either an animated or permanently underlined button, depending on which page you're on */}
            <button className={(activePage === destination) ? classes.sidebarButtonUnderlined : classes.sidebarButtonAnimated}
                onClick={() => navigate("/" + destination)}>
                {destination.charAt(0).toUpperCase() + destination.slice(1)}
            </button>
        </Box>
    );
}

// React component for the profile banner at the bottom of the sidebar
const ProfileBanner = () : JSX.Element => {
    return (
        <Box className={classes.profileBanner}>
            <img src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z" />
            <p>
                Gregor Kiczales <br/>
                gregor@cs.ubc.ca
            </p>
        </Box>
    );
}

export default EditorSidebar;
