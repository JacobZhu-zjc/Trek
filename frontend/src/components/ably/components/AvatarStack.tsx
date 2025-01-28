import {useMembers} from "@ably/spaces/react";

import Avatars from "./Avatars";

import type {Member} from "../utils/helpers";

import styles from "./AvatarStack.module.css";

const AvatarStack = () => {

    /** 💡 Get everybody except the local member in the space and the local member 💡 */
    const {others, self} = useMembers();
    const online = others.filter(user => user.isConnected);

    return (
        <div id="avatar-stack" className={`${styles.container}`}>
            {/** 💡 Stack of first 5 user avatars including yourself.💡*/}
            <Avatars self={self as Member | null} otherUsers={online as Member[]}/>
        </div>
    );
};

export default AvatarStack;
