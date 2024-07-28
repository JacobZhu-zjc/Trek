import { Card, Image, Text, Group, Avatar, Center } from '@mantine/core';
import classes from './index.module.css';


function TripCard() {

    const trip = {
        name: "Trip Name",
        desc: "Trip Description",
        owner: {
            _id: "123",
            name: "Owner Name",
            profilePicture: "https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z",
        },
        thumbnail: "https://npa.ca/wp-content/uploads/2020/08/Nanimo_HarbourFront.jpg"
    }

    const linkProps = { href: 'https://mantine.dev', target: '_blank', rel: 'noopener noreferrer' };

    return (
        <Card withBorder radius="md" className={classes.card} maw={300}>
            <Card.Section>
                <a {...linkProps}>
                    <Image src="https://i.imgur.com/Cij5vdL.png" height={180} />
                </a>
            </Card.Section>

            <Text className={classes.title} fw={500} component="a" {...linkProps}>
                {trip.name}
            </Text>

            <Text fz="sm" c="dimmed" lineClamp={4}>
                {trip.desc}
            </Text>

            <Group justify="flex-start" className={classes.footer}>
                <Center>
                    <Avatar
                        src={trip.owner.profilePicture}
                        size={24}
                        radius="xl"
                        mr="xs"
                    />
                    <Text fz="sm" inline>
                        {trip.owner.name}
                    </Text>
                </Center>
            </Group>
        </Card>
    );
}

export default TripCard;