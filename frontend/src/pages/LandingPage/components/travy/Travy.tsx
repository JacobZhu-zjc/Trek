import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef, useState} from "react";
import UserMessageBubble from "./components/UserMessageBubble";
import BotMessageBubble from "./components/BotMessageBubble";
import {IconArrowRight} from "@tabler/icons-react";

const containerVariants = {
    hidden: {
        opacity: 0,
        y: 30
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut",
            delayChildren: 0.3,
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: {
        opacity: 0,
        y: 15
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const userMessage = {
    hidden: {
        opacity: 0,
        x: -50,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            delay: 1,
            duration: 0.3,
            ease: "easeOut"
        }
    }
};

const botMessage = {
    hidden: {
        opacity: 0,
        x: -50,
        transition: {
            duration: 0.3,
            ease: "easeOut"
        }
    },
    visible: {
        opacity: 1,
        x: 0,
        transition: {
            delay: 2,
            duration: 0.3,
            ease: "easeOut"
        }
    }
}

export default function Travy() {
    const textRef = useRef(null);
    const controls = useAnimation();
    const userMessageControls = useAnimation();
    const [botMessageText, setBotMessageText] = useState("");
    const [userMessageVisible, setUserMessageVisible] = useState(false);

    const isInView = useInView(textRef, {once: false});

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
            userMessageControls.start("visible");
            setUserMessageVisible(true);
            setBotMessageText(`Based on your trip to Vancouver this summer, I have some great recommendations for a night out with your friends:`);
        }
    }, [isInView, controls, userMessageControls]);

    return (
        <motion.div
            ref={textRef}
            className="flex w-full select-none items-center justify-center"
            animate={controls}
            initial="hidden"
        >
            <motion.div
                variants={containerVariants}
                className="flex aspect-[1/1.41] h-[600px] md:h-[750px] flex-col rounded-2xl bg-white border-4 border-dark-blue"
            >
                <motion.div
                    variants={itemVariants}
                    className="relative flex-1 h-full overflow-auto my-[5] mx-0"
                >
                    <div className="mx-10 mb-[0] h-full flex flex-col">
                        <motion.div
                            variants={userMessage}
                            animate={userMessageControls}
                            initial="hidden"
                            className="mb-4"
                        >
                            <UserMessageBubble message="Is there anywhere I can take my friends for a night out?"/>
                        </motion.div>
                        {userMessageVisible && (
                            <motion.div
                                className="mt-4"
                                initial="hidden"
                                animate="visible"
                                variants={botMessage}
                            >
                                <BotMessageBubble stream={botMessageText} setIsInputDisabled={() => {
                                }} setIsScrollable={() => {
                                }}/>
                            </motion.div>
                        )}
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="w-full p-0 relative"
                >
                    <div
                        className="w-full md:rounded-lg py-2 px-4 placeholder-gray-500 border border-gray-300 bg-gray-100 text-gray-500 flex items-center justify-between"
                    >
                        <span className="text-gray-500">Ask Travy a question about your Trip!</span>
                        <button
                            className="bg-gradient-to-r from-teal-400 to-lime-400 p-2 rounded-full"
                        >
                            <IconArrowRight className="w-4 h-4" stroke={1.5}/>
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </motion.div>
    );
}
