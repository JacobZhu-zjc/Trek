import {Badge, Card, Group, Image, Text} from '@mantine/core';
import React from 'react';

interface TripCardProps {
    image: string;
    title: string;
    description: string;
}

const TripCard: React.FC<TripCardProps> = ({image, title, description}) => {
    return (
        <Card className="w-80" shadow="sm" padding="lg" radius="md" withBorder>
            <Card.Section>
                <Image
                    src={image}
                    className="h-40"
                    alt="UBC Campus"
                />
            </Card.Section>
            <Group justify="space-between" mt="md" mb="xs">
                <Text fw={500}>{title}</Text>
                <Badge color="green">Popular</Badge>
            </Group>
            <Text size="sm" c="dimmed">
                {description}
            </Text>
        </Card>
    );
}

export default TripCard;
