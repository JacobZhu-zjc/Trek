import { useEffect } from "react";
import GeneralForm from "./GeneralForm";
import PeopleForm from "./PeopleForm";
import TodoForm from "./TodoForm";
import PageHero from "../../components/PageHero";
import BudgetForm from "./BudgetForm.tsx";
import DeleteTrip from "./components/DeleteTrip.tsx";
import {useAuth0} from "@auth0/auth0-react";
import {useDispatch, useSelector} from "react-redux";
import {Trip} from "@trek-types/trip.ts";
import {getTripAsync} from "../../redux/trips/thunks.ts";
import {useParams} from "react-router-dom";
import {AppDispatch} from "../../redux/store.ts";

// React component for Trip Details page
const TripDetailsApp = (): JSX.Element => {
    const {isAuthenticated, getAccessTokenSilently} = useAuth0();
    const tripUUID = useParams().uuid as string;
    const dispatch = useDispatch<AppDispatch>();

    /** Set Page Title To "Trip Details" */
    useEffect(() => {
        document.title = "Trip Details";
    }, []);

    useEffect(() => {
        let token = null;
        (async () => {
            token = await getAccessTokenSilently();

        })()
        if (isAuthenticated && token) {
            dispatch(getTripAsync({uuid: tripUUID, token: token}));
        }
    }, [dispatch, isAuthenticated]);

    const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);
    if (trip.owner != "") {
        return (
            <>
                <PageHero>
                    Trip Details
                </PageHero>
                <GeneralForm/>
                <BudgetForm/>
                <PeopleForm/>
                <TodoForm/>
                <DeleteTrip/>
            </>
        );
    } else {
        return (
            <div className="flex h-screen items-center justify-center text-center text-7xl font-bold text-red-800">
                Either you are not authenticated, or this trip is private!
            </div>
        )
    }

}


export default TripDetailsApp;
