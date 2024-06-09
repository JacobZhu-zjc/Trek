import { IconShare3 } from '@tabler/icons-react';
import { Card, Image, Text, Group, Button, ActionIcon, Avatar } from '@mantine/core';
import classes from './BadgeCard.module.css';
import { Link } from 'react-router-dom';

const mockdata = {
    image:
        'https://media.tacdn.com/media/attractions-splice-spp-674x446/07/71/39/f1.jpg',
    title: 'Graduation Trip',
    description:
        'Graduation trip to LA and Vegas with friends and colleagues.',
};

function AltTripCard() {
    const { image, title, description } = mockdata;

    return (
        <Card withBorder radius="md" p="md" className={classes.card}>
            <Card.Section>
                <Image src={image} alt={title} height={180} />
            </Card.Section>

            <Card.Section className={classes.section} mt="md">
                <Group justify="apart">
                    <Text fz="lg" fw={500}>
                        {title}
                    </Text>
                </Group>
                <Text fz="sm" mt="xs">
                    {description}
                </Text>
            </Card.Section>

            <Card.Section className={classes.section}>
                <Avatar.Group>
                    <Avatar src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/gregor-kiczales-2023-profile.jpg?h=8c577723&itok=HQl4iF8Z" />
                    <Avatar src="https://www.cs.ubc.ca/sites/default/files/styles/profile_page/public/people/photo_2010.jpeg?itok=CrQV58Be" />
                    <Avatar src="https://pbs.twimg.com/profile_images/487564770401210368/DIC26oA__400x400.jpeg" />
                    <Avatar>+5</Avatar>
                </Avatar.Group>
            </Card.Section>

            <Group mt="xs">
                <Link to="/trip/UUID/overview">
                    <Button radius="md" color='green' style={{ flex: 1 }}>
                        View Trip
                    </Button>
                </Link>
                <ActionIcon variant="default" radius="md" size={36}>
                    <IconShare3 stroke={1.5} />
                </ActionIcon>
            </Group>
        </Card>
    );
}

export default AltTripCard;