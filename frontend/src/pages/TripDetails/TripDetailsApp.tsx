import { useEffect } from "react";
import GeneralForm from "./GeneralForm";
import PeopleForm from "./PeopleForm";
import TodoForm from "./TodoForm";
import PageHero from "../../components/PageHero";

// React component for Trip Details page
const TripDetailsApp = (): JSX.Element => {


  /** Set Page Title To "Trip Details" */
  useEffect(() => {
    document.title = "Trip Details";
  }, []);

  // useEffect(() => {
  //   function onConnect() {
  //     setIsConnected(true);
  //     socket.emit("nameConnect", testName);
  //   }

  //   function onDisconnect() {
  //     setIsConnected(false);
  //   }

  //   function onNumUsersUpdate(numUsers: number) {
  //     setNumUsers(numUsers);
  //   }

  //   socket.on('connect', onConnect);
  //   socket.on('disconnect', onDisconnect);

  //   socket.on('numUsersUpdate', onNumUsersUpdate);

  //   socket.connect();

  //   return () => {
  //     socket.off('connect', onConnect);
  //     socket.off('disconnect', onDisconnect);
  //     socket.off("numUsersUpdate", onNumUsersUpdate);
  //     socket.disconnect();
  //   }
  // }, []);

  return (
    <>
      <PageHero>
        Trip Details
      </PageHero>
      <GeneralForm />
      <PeopleForm />
      <TodoForm />
    </>
  );
}


export default TripDetailsApp;
