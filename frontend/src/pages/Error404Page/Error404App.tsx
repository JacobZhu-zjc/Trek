import { useEffect } from "react";

const Error404App = () => {
    /** Set Page Title To "404 Not Found" */
    useEffect(() => {
        document.title = "404 Not Found";
    }, []);

    return (
        <div className="relative h-screen w-screen">
            <img className="absolute inset-0 w-screen h-screen object-top opacity-10"
                 src="https://mediaproxy.salon.com/width/1200/https://media2.salon.com/2016/08/this_is_not_fine.jpg"
                 alt="This is not fine meme"/>
            <div className="relative flex flex-col justify-center items-center h-screen">
                <h1 className="text-red-800 text-6xl font-bold">Error 404</h1>
                <div className="text-red-800 text-4xl">Oops! You've run into an unknown page D:</div>
                <div className="absolute flex justify-center inset-x-0 bottom-0">
                    Image Source: h
                    <a href="https://thenib.com/this-is-not-fine/">
                        ttps://thenib.com/this-is-not-fine/
                    </a>
                </div>
            </div>
        </div>
    );
}

export default Error404App;