import { Avatar, Tooltip } from "@mantine/core";
import { BasicUser } from "../../types/user";

interface UserAvatarListProps {
    /** List of Users to include (in order) */
    users: BasicUser[];
    /**
     * Maximum number of pictured users to display
     * before displaying a "+n" avatar
     */
    limit: number;
}
const UserAvatarList = ({ users, limit }: UserAvatarListProps) => {

    const firstUsers = users.slice(0, limit);
    const remainingUsers = users.slice(limit);

    const firstUsersAvatars = firstUsers.map((user, index) => {
        return (
            <Tooltip label={user ? user.name : ""} key={user ? user._id : index} withArrow>
                <Avatar src={user ? user.profilePicture : ""} radius="xl" />
            </Tooltip>)
    });

    const remainingUsersAvatars = remainingUsers.map((user) => {
        return (
            <div>
                {user.name}
            </div>)
    });

    const remainingCount = remainingUsers.length;

    return (
        <>
            <Avatar.Group spacing="sm">
                {firstUsersAvatars}
                {remainingCount !== 0
                    &&
                    <Tooltip
                        withArrow
                        label={
                            <>
                                {remainingUsersAvatars}
                            </>
                        }>
                        <Avatar radius="xl">+{remainingCount}</Avatar>
                    </Tooltip>}
            </Avatar.Group>
        </>)

};

export default UserAvatarList;
