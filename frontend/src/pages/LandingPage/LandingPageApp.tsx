import {useEffect, useRef} from "react";
import LandingPageTitle from "./components/LandingPageTitle.tsx";
import {Box} from "@mantine/core";
import HorizontalScrollCardCarousel from "./components/CardCarousel.tsx";
import GoogleDocs from "./components/ditch-the-google-docs/GoogleDocs.tsx";
import Travy from "./components/travy/Travy.tsx";
import TripCard from "./components/TripCard.tsx";
import {motion, useInView} from "framer-motion";


const LandingPageApp = () => {

    /** Set Page Title To "Trek" */
    useEffect(() => {
        document.title = "Trek";
    }, []);


    const textRef = useRef(null);
    const isInView = useInView(textRef, {once: true})

    return (
        <>
            <Box className="h-full w-full">

                <LandingPageTitle/>

                <div className="bg-gradient-to-r from-[#f0f4fa] to-[#ffffff] h-screen flex items-center justify-center">
                    <div className="flex flex-col sm:flex-row w-full max-w-6xl mx-auto px-4">
                        <div className="flex-1 sm:max-w-[50%] sm:pr-8 mb-8 sm:mb-0">
                            <h1 className="text-[36px] font-semibold font-lexend mb-4 leading-[1.3]">
                                Google Docs was Never Designed for Trip Planning
                            </h1>
                            <p className="text-lg text-slate-700 font-lexend">
                                Say goodbye to chaotic planning and endless revisions.<br/>
                                Say hello to Trek, built by travellers, for travellers. Trek provides a
                                collaborative trip planner that is easy to use, helping you effortlessly
                                organize your travel plans with what you want to do.
                            </p>
                        </div>

                        <div className="flex-none sm:pl-16">
                            <GoogleDocs/>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-[#f0f4fa] to-[#ffffff] h-screen flex items-center justify-center">
                    <div className="flex flex-col-reverse sm:flex-row w-full max-w-6xl mx-auto px-4">
                        <div className="flex-none sm:pr-16 mt-8 sm:mt-0">
                            <Travy/>
                        </div>
                        <div className="flex-1 sm:max-w-[50%] sm:pl-4">
                            <div className="flex items-center justify-center h-full">
                                <div>
                                    <h1 className="text-[36px] font-semibold font-lexend mb-4 leading-[1.3]">
                                        Travel with a 24/7 Personal Travel Assistant
                                    </h1>
                                    <p className="text-lg text-slate-700 font-lexend">
                                        Meet Travy, your personal travel assistant. Travy is here to help you plan your
                                        trip, answer your questions, and provide recommendations based on your
                                        preferences.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Box visibleFrom="md">
                    <HorizontalScrollCardCarousel/>
                </Box>
                <Box hiddenFrom="md">
                    <motion.div
                        ref={textRef}
                        initial={{opacity: 0, y: 20}}
                        animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                        transition={{duration: 0.5, delay: 0.2}}
                        className="top-20 pt-10 pb-10"
                    >
                        <h1 className="font-lexen text-center lg:text-6xl text-3xl font-semibold mb-10">Explore from
                            Thousands of Destinations</h1>
                        <p className="text-xl text-center text-balance max-w-5xl mx-auto">
                            Read our travel guide from thousands of cities around the world. Find the best places to
                            visit, eat, and stay, and get inspired for your next adventure.
                        </p>
                    </motion.div>
                    <div className="block lg:hidden">
                        <div className="flex flex-col items-center gap-8">
                            <TripCard
                                image="https://www.grad.ubc.ca/sites/default/files/image/pane/40599822632_daa3fe1a34_k.jpg"
                                title="Vancouver, B.C."
                                description="Vancouver, British Columbia, is a vibrant coastal city located in the western part of Canada. Known for its stunning natural beauty, the city is surrounded by mountains and the Pacific Ocean, offering a unique blend of urban and outdoor lifestyles."
                            />
                            <TripCard
                                image="https://media.istockphoto.com/id/1397763152/photo/oia-town-on-santorini-island-greece-traditional-and-famous-houses-and-churches-with-blue.webp?b=1&s=170667a&w=0&k=20&c=U1VRKuyUzuALBAYhhGg-dibcby5QweOS9YgFuc2Kfq0="
                                title="Santorini, Greece"
                                description="Santorini is a picturesque island in the Aegean Sea, known for its stunning sunsets and white-washed buildings. The island features beautiful beaches and charming villages like Oia and Fira. Santorini is also famous for its delicious cuisine and local wines."
                            />
                            <TripCard
                                image="https://i.natgeofe.com/n/0652a07e-42ed-4f3d-b2ea-0538de0c5ba3/seattle-travel_3x2.jpg"
                                title="Seattle, Washington"
                                description="Seattle, Washington, is a vibrant city known for the Space Needle and its thriving tech industry. It's surrounded by beautiful landscapes like Puget Sound and the Cascade Mountains. Seattle is also famous for its coffee culture and rich arts scene."
                            />
                        </div>
                    </div>
                </Box>

            </Box>
        </>
    );
}

export default LandingPageApp;
