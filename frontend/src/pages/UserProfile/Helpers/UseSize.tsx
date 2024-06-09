import {useEffect, useState} from "react";

/*
Followed guide for custom hook to get window's dimensions from
https://dev.to/payalsasmal/custom-hook-to-get-windows-width-and-height-in-react-dynamically-4b4l
 */
export default function useSize() {
    const [windowSize, setWindowSize] = useState({
        h: window.innerHeight,
        w: window.innerWidth
    });

    useEffect(() => {
        function windowSizeHandler() {
            setWindowSize({h: window.innerHeight, w: window.innerWidth});
        }
        window.addEventListener("resize", windowSizeHandler);

        return () => {
            window.removeEventListener("resize", windowSizeHandler);
        }

    }, []);

    return windowSize;
}
