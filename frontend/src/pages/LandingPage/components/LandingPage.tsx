const LandingPage = () => {
    return (
        <div
            className="relative inset-0 -z-10 min-h-screen w-full bg-emerald-50 bg-[linear-gradient(to_right,#d1fae5_1px,transparent_1px),linear-gradient(to_bottom,#d1fae5_1px,transparent_1px)] bg-[size:6rem_4rem]">
            <div
                className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[radial-gradient(circle_800px_at_100%_500px,#a7f3d0,transparent)]"/>
            <div
                className="absolute bottom-0 left-0 right-0 top-0 -z-10 bg-[radial-gradient(circle_800px_at_15%_800px,#a7f3d0,transparent)]"/>
            <div className="flex flex-wrap md:flex-nowrap h-screen">
                <div className="w-full flex items-center justify-center p-4 sm:p-8">
                    <div>
                        <h1 className="text-4xl lg:text-7xl font-bold py-2 text-center md:text-left">Welcome to
                            Trek!</h1>
                        <p className="pl-2 text-center md:text-left">Design your ideal trip with your friends all in one
                            place.</p>
                    </div>
                </div>
                <div className="w-full flex items-center justify-center p-4">
                    <div className="shadow-2xl">
                        <img
                            src="https://grantme.ca/wp-content/uploads/2022/01/AdobeStock_479457864-scaled.jpeg"
                            alt="Tree-decorated path at UBC"
                            className="rounded w-full h-auto"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
