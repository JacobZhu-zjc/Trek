import {useRef} from "react";
import {motion, useInView, useScroll, useTransform} from "framer-motion";
import TripCard from "./TripCard";

const HorizontalScrollCardCarousel = () => {
    const targetRef = useRef(null);
    const textRef = useRef(null);
    const isInView = useInView(textRef, {once: true});

    const {scrollYProgress} = useScroll({
        target: targetRef,
    });

    // Define transforms for each card individually
    const x1 = useTransform(scrollYProgress, [0, 0.33], ["-100%", "-110%"]);
    const x2 = useTransform(scrollYProgress, [0.33, 0.66], ["100%", "110%"]);
    const x3 = useTransform(scrollYProgress, [0.66, 1], ["0%", "0%"]); // stays in the middle

    const y1 = useTransform(scrollYProgress, [0, 0.33], ["200%", "25%"]);
    const y2 = useTransform(scrollYProgress, [0.33, 0.66], ["230%", "25%"]);
    const y3 = useTransform(scrollYProgress, [0.66, 1], ["260%", "25%"]);

    return (
        <section ref={targetRef} className="relative h-[300vh]">
            <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
                <motion.div
                    ref={textRef}
                    initial={{opacity: 0, y: 20}}
                    animate={isInView ? {opacity: 1, y: 0} : {opacity: 0, y: 20}}
                    transition={{duration: 0.5, delay: 0.2}}
                    className="absolute top-20"
                >
                    <h1 className="font-lexen text-center lg:text-6xl text-3xl font-semibold mb-10">Explore from
                        Thousands of Destinations</h1>
                    <p className="text-xl text-center text-balance max-w-5xl mx-auto">
                        Read our travel guide from thousands of cities around the world. Find the best places to visit,
                        eat, and stay, and get inspired for your next adventure.
                    </p>
                </motion.div>
                <motion.div style={{x: x1, y: y1}} className="absolute">
                    <TripCard
                        image="https://www.grad.ubc.ca/sites/default/files/image/pane/40599822632_daa3fe1a34_k.jpg"
                        title="Vancouver, B.C."
                        description="Vancouver, British Columbia, is a vibrant coastal city located in the western part of Canada. Known for its stunning natural beauty, the city is surrounded by mountains and the Pacific Ocean, offering a unique blend of urban and outdoor lifestyles."
                    />
                </motion.div>
                <motion.div style={{x: x2, y: y2}} className="absolute">
                    <TripCard
                        image="https://media.istockphoto.com/id/1397763152/photo/oia-town-on-santorini-island-greece-traditional-and-famous-houses-and-churches-with-blue.webp?b=1&s=170667a&w=0&k=20&c=U1VRKuyUzuALBAYhhGg-dibcby5QweOS9YgFuc2Kfq0="
                        title="Santorini, Greece"
                        description="Santorini is a picturesque island in the Aegean Sea, known for its stunning sunsets and white-washed buildings. The island features beautiful beaches and charming villages like Oia and Fira. Santorini is also famous for its delicious cuisine and local wines."
                    />
                </motion.div>
                <motion.div style={{x: x3, y: y3}} className="absolute">
                    <TripCard
                        image="https://i.natgeofe.com/n/0652a07e-42ed-4f3d-b2ea-0538de0c5ba3/seattle-travel_3x2.jpg"
                        title="Seattle, Washington"
                        description="Seattle, Washington, is a vibrant city known for the Space Needle and its thriving tech industry. It's surrounded by beautiful landscapes like Puget Sound and the Cascade Mountains. Seattle is also famous for its coffee culture and rich arts scene."
                    />
                </motion.div>
            </div>
        </section>
    );
};

export default HorizontalScrollCardCarousel;
