import {type SpaceMember} from "@ably/spaces";

export const MAX_USERS_BEFORE_LIST = 4;
export const HORIZONTAL_SPACING_OFFSET = 40;
export const OVERLAP_AMOUNT = 40;
export const AVATAR_WIDTH = 48;

export type Member = Omit<SpaceMember, "profileData"> & {
    profileData: { memberColor: string; name: string };
    location: { index?: number };
};

export type MemberProperty = "memberColor" | "name";

export const getMemberProperty = (
    cellMembers: Member[],
    property: MemberProperty,
): string | null => {
    if (cellMembers.length > 0 && property in cellMembers[0].profileData) {
        return cellMembers[0].profileData[property];
    }
    return null;
};

export function calculateRightOffset({
                                         usersCount,
                                         index = 0,
                                     }: {
    usersCount: number;
    index: number;
}): number {
    return usersCount > MAX_USERS_BEFORE_LIST
        ? (index + 1) * HORIZONTAL_SPACING_OFFSET
        : index * HORIZONTAL_SPACING_OFFSET;
}

export function calculateTotalWidth({users}: { users: Member[] }): number {
    return (
        AVATAR_WIDTH +
        OVERLAP_AMOUNT * Math.min(users.length, MAX_USERS_BEFORE_LIST + 1)
    );
}
