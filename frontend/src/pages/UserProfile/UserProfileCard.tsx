/**
 * @deprecated use ./components/UserProfileCard.tsx instead
 */

import {Link} from "react-router-dom";

const UserProfileCard = () => {
    return (
        <div className="flex justify-center my-8 max-h-60 bg-trek-green-light rounded-md">
            <div className="grid grid-cols-5 gap-5">
                <img
                    src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z"
                    alt="Gregor Kiczales"
                    className="flex justify-end rounded-full col-span-2 p-5 max-h-56"
                />
                <div className="col-span-3 text-trek-green-dark content-center">
                    <p className="text-4xl font-bold my-2">Gregor Kiczales</p>
                    <p className="my-2"><span>gregor@cs.ubc.ca</span> • <span>He/Him</span></p>
                    <div className="flex flex-row gap-2">
                        <Link to="/settings/profile">
                            <button className="bg-trek-green-dark text-trek-green-light rounded-md px-8 py-1 my-2">
                                Edit Profile
                            </button>
                        </Link>
                        <button className="bg-trek-green-dark text-trek-green-light rounded-md px-8 py-1 my-2">
                            <img src="../../assets/share.png" alt="Share"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserProfileCard;
