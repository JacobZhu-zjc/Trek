
import UserProfileCard from "./components/UserProfileCard";
import { Container, Flex } from "@mantine/core";
import PaginatedTrips from "./components/PaginatedTrips";

const UserProfileApp = () => {
  // const windowSize = useSize();
  return (
    <>
      <div className="h-64 bg-trek-green-light">

      </div>
      <Flex>
        <Container mt={-100} miw={{ base: "100%", sm: 400 }} ml={{ base: 0, md: 50}}>
          <UserProfileCard />
        </Container>
      </Flex>

      <PaginatedTrips />
    </>
  )
}

export default UserProfileApp;
