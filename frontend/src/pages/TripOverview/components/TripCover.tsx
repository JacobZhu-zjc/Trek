import {Avatar, Box, Group, Stack, Text} from "@mantine/core"
import {BasicUser} from "../../../types/user";
import UserAvatarList from "../../../components/user-info/UserAvatarList";
import DefaultPhoto from "@assets/default-trip-cover.jpg"
import {useEffect, useState} from "react";

export interface TripCoverProps {
    tripName: string;
    tripOwner: string;
    tripMembers: BasicUser[];
    photoUrl?: string;
}

const TripCover = ({tripName, tripOwner, tripMembers, photoUrl}: TripCoverProps) => {
    const [ownerName, setOwnerName] = useState<string>("");
    const [ownerEmail, setOwnerEmail] = useState<string>("");
    const [ownerPfp, setOwnerPfp] = useState<string>("");
    const uri = import.meta.env.PROD ? window.location.origin : "http://localhost:3000";

    useEffect(() => {
        (async () => {
            const response = await fetch(`${uri}/api/v1/users/id/${tripOwner}`, {
                method: "GET",
            });
            if (response.ok) {
                const data = await response.json();
                setOwnerName(data.name);
                setOwnerEmail(data.email);
                setOwnerPfp((data.uploadedProfilePictureURL && data.uploadedProfilePictureURL !== "") ? data.uploadedProfilePictureURL : data.image);
            }
        })();


    }, [tripOwner])

    if (!photoUrl) {
        console.log("No photo url provided, using default");
        photoUrl = DefaultPhoto;
    }

    return (<>
        <Box w={"100%"} h={"400px"} pos="relative">
            <img src={photoUrl}
                 alt="Overlay" className="w-full h-full object-cover"/>
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            <Stack className="absolute bottom-0 w-full p-8" justify="flex-end">
                <Text lineClamp={2} className="text-3xl text-white" style={{color: 'white'}}>
                    {tripName}
                </Text>
                <Group justify="space-between" className="text-3xl text-white">

                    <Group>
                        <Avatar
                            src={ownerPfp}
                            radius="xl"
                        />

                        <div style={{flex: 1}}>
                            <Text size="sm" fw={500}>
                                {ownerName}
                            </Text>

                            <Text c="dimmed" size="xs">
                                {ownerEmail}
                            </Text>
                        </div>
                    </Group>

                    <Group>
                        {tripMembers ? (<UserAvatarList users={tripMembers} limit={3}/>) : (<></>)}
                    </Group>
                </Group>
            </Stack>

        </Box>
    </>)
}

export default TripCover;
