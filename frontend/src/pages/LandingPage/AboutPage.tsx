import { Flex } from '@mantine/core';
import TripCard from './components/TripCard'

const AboutPage = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center">
        <div className="flex-1 px-4 py-20 text-center">
          <h1 className="lg:text-6xl text-3xl font-bold">Turn group plans into real adventures.</h1><br />
          <p className="text-xl text-center text-balance max-w-5xl mx-auto">
            Struggling to plan a group trip that actually makes it out of the group chat? Trek makes
            planning a trip with your friends easy! Eliminate the need for messy Google Docs and centralize
            your group's ideas to design your ideal trip.
          </p>
        </div>
        <Flex
          justify="center"
          className='w-full'
          align="center"
          direction="row"
          wrap="wrap"
          gap="sm">
          <div className="px-8">
            <TripCard
              image="https://www.grad.ubc.ca/sites/default/files/image/pane/40599822632_daa3fe1a34_k.jpg"
              title="Vancouver, B.C."
              description="Vancouver, British Columbia, is a vibrant coastal city located in the western part of Canada. Known for its stunning natural beauty, the city is surrounded by mountains and the Pacific Ocean, offering a unique blend of urban and outdoor lifestyles."
            />
          </div>
          <div className="px-8">
            <TripCard
              image="https://i.natgeofe.com/n/0652a07e-42ed-4f3d-b2ea-0538de0c5ba3/seattle-travel_3x2.jpg"
              title="Seattle, Washington"
              description="Seattle, Washington, is a vibrant city known for the Space Needle and its thriving tech industry. It's surrounded by beautiful landscapes like Puget Sound and the Cascade Mountains. Seattle is also famous for its coffee culture and rich arts scene."
            />

          </div>
          <div className="px-8">
            <TripCard
              image="https://media.istockphoto.com/id/1397763152/photo/oia-town-on-santorini-island-greece-traditional-and-famous-houses-and-churches-with-blue.webp?b=1&s=170667a&w=0&k=20&c=U1VRKuyUzuALBAYhhGg-dibcby5QweOS9YgFuc2Kfq0="
              title="Santorini, Greece"
              description="
Santorini is a picturesque island in the Aegean Sea, known for its stunning sunsets and white-washed buildings. The island features beautiful beaches and charming villages like Oia and Fira. Santorini is also famous for its delicious cuisine and local wines."
            />
          </div>
        </Flex>
      </div >
    </>
  );
}

export default AboutPage;
