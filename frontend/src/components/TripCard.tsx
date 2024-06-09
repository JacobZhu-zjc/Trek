import cat from "../assets/cat.jpg"
import dog1 from "../assets/dog1.jpg"
import dog2 from "../assets/dog2.jpg"
import map from "../assets/map.png"

const TripCard = () => {
  return (
    <div className="border border-gray-300 shadow-md p-3">
      <h1 className="font-bold text-3xl px-5">End of Month Celebration</h1>
      <br />
      <div className="grid grid-cols-3">
        <div className="col-span-1 px-5">
          <div className="grid items-center grid-cols-2">
            <img src={cat} alt="Image of username1" className="rounded-full p-3 aspect-square" />
            <img src={dog1} alt="Image of username2" className="rounded-full p-3 aspect-square" />
            <img src={dog2} alt="Image of username3" className="rounded-full p-3 aspect-square" />
          </div>
          <div className="text-center">
            <a href="#" className="italic underline">+ 5 more</a>
          </div>
        </div>
        <div className="bg-gray-200 w-full col-span-2 px-2">
          <span className="text-xl">Jan 25, 2025 &mdash; Feb 4, 2025</span>
          <div className="grid grid-cols-2">
            <img src={map} alt="Map of trip" />
            <p className="px-5">Let's all have a fun celebration for the end of the first month of 2025!!!</p>
          </div>
        </div>
      </div>
    </div>
  );

}

export default TripCard;