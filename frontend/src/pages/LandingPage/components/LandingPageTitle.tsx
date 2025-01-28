import {IconPointer, IconRoute, IconSparkles} from "@tabler/icons-react";
import {motion} from "framer-motion";

const LandingPageTitle = () => {
    const container = {
        hidden: {opacity: 0},
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // Adjust this value to control the delay between each item's animation
            },
        },
    };

    const leftItem = {
        hidden: {opacity: 0, x: -30},
        show: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1], // Bezier curve for ease transition
            },
        },
    };

    const rightItem = {
        hidden: {opacity: 0, x: 50},
        show: {
            opacity: 1,
            x: 0,
            transition: {duration: 0.3},
        },
    };

    const topItem = {
        hidden: {opacity: 0, y: -30},
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1], // Bezier curve for ease transition
            },
        },
    };

    const diagnalItem = {
        hidden: {opacity: 0, x: 30, y: 30},
        show: {
            opacity: 1,
            x: 0,
            y: 0,
            transition: {
                duration: 0.3,
                ease: [0.4, 0, 0.2, 1], // Bezier curve for ease transition
            },
        },
    };

    const bottomRotateItem = {
        hidden: {opacity: 0, y: 30, rotate: -45},
        show: {
            opacity: 1,
            y: 0,
            rotate: 0,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1], // Bezier curve for ease transition
            },
        },
    };

    return (
        <div className="w-full">

            <motion.section
                variants={container}
                initial="hidden"
                animate="show"
                className="flex flex-col items-center justify-center text-[#004015] gap-2"
            >
                <div className="flex items-center">
                    <motion.p
                        variants={leftItem}
                        className="text-[70px] font-semibold font-lexend"
                    >
                        Travel
                    </motion.p>
                    <motion.span
                        variants={topItem}
                        className="inline-flex items-center text-[#7AEA9F] ml-4"
                    >
                        <IconRoute strokeWidth={2} size={40}/>
                    </motion.span>
                    <motion.p
                        variants={leftItem}
                        className="font-semibold font-lexend text-[50px] sm:text-[70px] ml-4"
                    >
                        the Way
                    </motion.p>
                </div>
                <div className="flex items-center -mt-8">
                    <motion.p
                        variants={rightItem}
                        className="font-semibold font-lexend text-[50px] sm:text-[70px]"
                    >
                        You Want
                    </motion.p>
                    <motion.span
                        variants={diagnalItem}
                        className="inline-flex items-center text-[#7AEA9F] ml-2"
                    >
                        <IconPointer strokeWidth={2} size={40}/>
                    </motion.span>
                </div>
                <div className="flex items-center -mt-8">
                    <motion.span
                        variants={bottomRotateItem}
                        className="inline-flex items-center text-[#7AEA9F]"
                    >
                        <IconSparkles strokeWidth={2} size={40}/>
                    </motion.span>
                    <motion.p
                        variants={leftItem}
                        className="font-semibold font-lexend text-[50px] sm:text-[70px] ml-2"
                    >
                        with
                    </motion.p>
                    <motion.p
                        variants={leftItem}
                        className="font-medium font-poetsen text-[50px] sm:text-[70px] ml-4"
                    >
                        Trek
                    </motion.p>
                </div>
            </motion.section>
        </div>
    );
};

export default LandingPageTitle;
