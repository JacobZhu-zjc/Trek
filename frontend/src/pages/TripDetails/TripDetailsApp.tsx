import { useEffect } from "react";
import GeneralForm from "./GeneralForm";
import PeopleForm from "./PeopleForm";
import TodoForm from "./TodoForm";
import PageHero from "../../components/PageHero";

// Props for the TripDetailsApp component
interface contextProps {
  // True if the user is creating an entirely new trip, instead of updating a pre-existing one
  isNewtrip?: boolean,
}

// React component for Trip Details page
const TripDetailsApp = (props: contextProps): JSX.Element => {
  /** Set Page Title To "Trip Details" */
  useEffect(() => {
    document.title = "Trip Details";
  }, []);

  return (
    <>
      <PageHero>
        Trip Details
      </PageHero>
      <GeneralForm isNewTrip={props.isNewtrip} />
      <PeopleForm />
      <TodoForm />
    </>
  );
}


export default TripDetailsApp;
