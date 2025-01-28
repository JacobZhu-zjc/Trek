import {useContext, useEffect} from "react";
import PageHero from "../../components/PageHero.tsx";
import AvatarStack from "@components/ably/components/AvatarStack.tsx";
import {useDispatch, useSelector} from "react-redux";
import {useParams} from "react-router-dom";
import {AppDispatch} from "../../redux/store.ts";
import {UserContext} from "../../App.tsx";
import {getTripAsync} from "../../redux/trips/thunks.ts";
import {State} from "@trek-types/redux.ts";
import GeneralForm from "./components/GeneralForm.tsx";
import AdvancedForm from "./components/AdvancedForm.tsx";
import {Box} from "@mantine/core";
import PeopleForm from "./components/PeopleForm.tsx";

// React component for Trip Settings (Details) page
const TripSettingsApp = (): JSX.Element => {

    const dispatch = useDispatch<AppDispatch>();
    const tripUUID = useParams().uuid as string;
    const userContext = useContext(UserContext);
    const token = userContext.token;

    /** Set Page Title To "Trip Settings" */
    useEffect(() => {
        document.title = "Trip Settings";
    }, []);

    const trip = useSelector((state: State) => state.trip.current);

    useEffect(() => {
        if (trip && trip._id === tripUUID) {
            return;
        }
        dispatch(getTripAsync({uuid: tripUUID, token: token}));
    }, [dispatch, token]);


    if (trip) {
        return (
            <>
                <PageHero>
                    Trip Settings
                    <AvatarStack/>
                </PageHero>
                <Box m={"xl"}>
                    <Box pt={"lg"}>
                        <GeneralForm/>
                    </Box>


                    <Box pt={"lg"}>
                        <PeopleForm/>
                    </Box>


                    <Box pt={"lg"}>
                        <AdvancedForm/>
                    </Box>
                </Box>
            </>
        );
    } else {
        return (
            <></>
        )
    }
}


export default TripSettingsApp;
