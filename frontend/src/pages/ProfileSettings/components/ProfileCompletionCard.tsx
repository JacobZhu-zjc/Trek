import {Text, Progress, Card} from '@mantine/core';

function ProfileCompletionCard() {
    return (
        <Card withBorder radius="md" padding="xl" bg="var(--mantine-color-body)">

            <Text fz="lg" fw={500}>
                Complete your profile
            </Text>
            <Text fz="xs" fw={700} c="dimmed">
                Set up your profile to get the most out of Trek
            </Text>
            <Progress value={54.31} mt="md" size="lg" radius="xl"/>
        </Card>
    );
}

export default ProfileCompletionCard;
