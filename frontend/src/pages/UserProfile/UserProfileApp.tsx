
import { useEffect } from "react";
import { Link } from "react-router-dom";
import TripCard from "../../components/TripCard";
import UserProfileCard from "./components/UserProfileCard";
// import {ScrollArea} from "@mantine/core";
// import useSize from "./Helpers/UseSize.tsx";
import { Container, Flex, Skeleton } from "@mantine/core";
import PaginatedTrips from "./components/PaginatedTrips";

const UserProfileApp = () => {
  // const windowSize = useSize();

  /** Set Page Title To "User Profile" */
  useEffect(() => {
    document.title = "User Profile";
  }, []);

  return (
    <>
      <div className="h-64 bg-trek-green-light">
      </div>

      <Flex>
        <Container mt={-100} miw={{ base: "100%", sm: 400 }} ml={{ base: 0, md: 50}}>
          <UserProfileCard />
        </Container>
        <Container w={"100%"} mt={30}>
          <Skeleton height={350} />
        </Container>
      </Flex>

      <PaginatedTrips />







      <div className="h-screen max-h-screen font-mono px-16 overflow-auto">
        <div className="flex flex-col">
          <div className="flex flex-col my-4 gap-2 max-h-[540px] overflow-scroll">
            <Link to="/trip/UUID/overview">
              <TripCard />
            </Link>
            <Link to="/trip/UUID/overview">
              <TripCard />
            </Link>
            <Link to="/trip/UUID/overview">
              <TripCard />
            </Link>
            <Link to="/trip/UUID/overview">
              <TripCard />
            </Link>
            <Link to="/trip/UUID/overview">
              <TripCard />
            </Link>
            <Link to="/trip/UUID/overview">
              <TripCard />
            </Link>
            <Link to="/trip/UUID/overview">
              <TripCard />
            </Link>
            <Link to="/trip/UUID/overview">
              <TripCard />
            </Link>
          </div>
          <button className="flex justify-center rounded-full bg-trek-green-light text-trek-green-dark text-4xl">
            +
          </button>
        </div>
      </div>
    </>


  )
}

export default UserProfileApp;
