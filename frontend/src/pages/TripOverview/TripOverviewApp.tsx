import { useEffect } from "react";
import { Box, ScrollArea } from "@mantine/core";
import PageHero from "../../components/PageHero";
import InformationPanel from "./InformationPanel";
import classes from "./Overview.module.css"

// React component for the Trip Overview page of the project
const TripOverviewApp = () => {
	/** Set Page Title To "Trip Overview" */
    useEffect(() => {
		document.title = "Trip Overview";
	}, []);

	return (
		<>
			<ScrollArea className={classes.scrollarea}>
				<PageHero>
					Trip Overview
				</PageHero>
				<InformationPanel />
			</ScrollArea>
			<ImageBar />
		</>
	);
}

// React component for the image bar across the bottom of the page
const ImageBar = (): JSX.Element => {
	return (
		<>
			<Box className={classes.imageBarBackground}></Box>
			<img className={classes.imageBar} src="https://i.natgeofe.com/n/73847add-3f26-471a-a2ac-36d02e28b335/British-Columbia_h_00000201749855.jpg"/>
		</>
	);
}

export default TripOverviewApp;
