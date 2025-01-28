import {Box} from "@mantine/core";
import classes from "./ProfileBanner.module.css"

// Props for the ProfileBanner component
interface bannerInfo {
    imgSrc: string,
    username: string,
    contact: string,
    funfact: string,
}

// React component for a banner displaying an individual member of a trip
const ProfileBanner = (props: bannerInfo): JSX.Element => {
    return (
        <Box className={classes.profileBanner}>
            <img src={props.imgSrc}/>
            <div>
                <strong>{props.username}</strong><br/>
                {props.contact}
            </div>
            <div className={classes.funfact}>
                {props.funfact}
            </div>
        </Box>
    );
}

export default ProfileBanner;
