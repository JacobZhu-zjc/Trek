import {useSpace} from "@ably/spaces/react";
import {Outlet} from "react-router-dom";
import {useContext, useEffect, useMemo} from "react";
import {UserContext} from "../../../App.tsx";
import {getMemberColor} from "@components/ably/utils/mockColors.ts";

const TripOutletWrapper = ({tripError}: { tripError: any }) => {
    const userContext = useContext(UserContext);
    const memberColor = useMemo(getMemberColor, []);

    /** 💡 Get a handle on a space instance 💡 */
    const {space} = useSpace();

    /** 💡 Enter the space as soon as it's available 💡 */
    const name = userContext.name;
    useEffect(() => {
        if (!tripError)
            space?.enter({name, memberColor});
    }, [space]);
    return (
        <Outlet/>
    );
};

export default TripOutletWrapper;
