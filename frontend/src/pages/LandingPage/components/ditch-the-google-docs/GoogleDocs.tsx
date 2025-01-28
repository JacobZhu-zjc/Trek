import {DocumentTextIcon} from "@heroicons/react/20/solid";
import {motion, useAnimation, useInView} from "framer-motion";
import {useEffect, useRef} from "react";
import AnimText from "./components/AnimatedText";

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

export default function GoogleDocs() {

    const textRef = useRef(null);
    const isInView = useInView(textRef, {once: true});
    const controls = useAnimation();

    useEffect(() => {
        if (isInView) {
            controls.start("visible");
        }
    }, [isInView, controls]);

    return (
        <motion.div
            ref={textRef}
            className="flex w-full select-none items-center justify-center"
            animate={controls}
            initial="hidden"
        >
            <motion.div
                variants={containerVariants}
                className="flex aspect-[1/1.41] h-[400px] md:h-[500px] flex-col rounded-2xl bg-white p-2 border-4 border-dark-blue"
            >
                <motion.div
                    variants={itemVariants}
                    className="flex items-center space-x-2"
                >
                    <DocumentTextIcon className="h-8 w-8 text-indigo-700"/>
                    <span className="text-slate-700">Untitled document</span>
                </motion.div>
                <motion.div
                    variants={itemVariants}
                    className="flex items-center justify-center"
                >
                    <div className="mt-2 flex space-x-4 rounded-full bg-slate-100 px-8 text-slate-700">
                        <strong>B</strong>
                        <span className="font-italic">I</span>
                        <span className="underline">U</span>
                        <strong className="underline">A</strong>
                    </div>
                </motion.div>
                <motion.span
                    variants={itemVariants}
                    className="inline h-full w-full p-8 text-lg text-slate-900"
                >
                    <AnimText delay={1}/>
                </motion.span>
            </motion.div>
        </motion.div>
    );
}
