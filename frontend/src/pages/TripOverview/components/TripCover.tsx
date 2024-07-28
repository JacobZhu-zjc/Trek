import { Box, Stack, Group, Avatar, Text } from "@mantine/core"
import { BasicUser } from "../../../types/user";
import UserAvatarList from "../../../components/user-info/UserAvatarList";
import DefaultPhoto from "@assets/default-trip-cover.jpg"
import {useEffect, useState} from "react";

export interface TripCoverProps {
    tripName: string;
    tripOwner: string;
    tripMembers: BasicUser[];
    photoUrl?: string;
}

const TripCover = ({ tripName, tripOwner, tripMembers, photoUrl }: TripCoverProps) => {
    const [ownerName, setOwnerName] = useState<string>("");
    const [ownerEmail, setOwnerEmail] = useState<string>("");
    const [ownerPfp, setOwnerPfp] = useState<string>("");
    useEffect(() => {
        (async () => {
            console.log(tripOwner);
            const response = await fetch(`http://localhost:3000/api/v1/users/id/${tripOwner}`, {
                method:"GET",
            }  );
            const data = await response.json();
            console.log(data);
            setOwnerName(data.name);
            setOwnerEmail(data.email);
            setOwnerPfp(data.image);
        })();


    }, [tripOwner])

    if (!photoUrl) {
        console.log("No photo url provided, using default");
        photoUrl = DefaultPhoto;
        console.log(photoUrl);
    }

    if (!photoUrl) {
        console.log("No photo url provided, using default");
        photoUrl = DefaultPhoto;
        console.log(photoUrl);
    }

    return (<>
        <Box w={"100%"} h={"400px"} pos="relative">
            <img src={photoUrl}
                alt="Overlay" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            <Stack className="absolute bottom-0 w-full p-8" justify="flex-end">
                <Text lineClamp={2} className="text-3xl text-white">
                    {tripName}
                </Text>
                <Group justify="space-between" className="text-3xl text-white">

                    <Group>
                        <Avatar
                            // TODO: change to amazon s3 link from db once set up
                            src={ownerPfp}
                            radius="xl"
                        />

                        <div style={{ flex: 1 }}>
                            <Text size="sm" fw={500}>
                                {ownerName}
                            </Text>

                            <Text c="dimmed" size="xs">
                                {ownerEmail}
                            </Text>
                        </div>
                    </Group>

                    <Group>
                        {tripMembers ? (<UserAvatarList users={tripMembers} limit={3} />) : (<></>)}
                    </Group>
                </Group>
            </Stack>

        </Box>
    </>)
}

export default TripCover;
