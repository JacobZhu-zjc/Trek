import Travy from '@assets/travy-profile.svg';
import {Avatar, Card, Center, Grid, Group, rem, Stack, Text, useMantineTheme} from '@mantine/core';
import {IconClock24, IconHeartHandshake, IconWorldLongitude} from '@tabler/icons-react';
import classes from './WelcomeDisplay.module.css';


const WelcomeDisplay = () => {

    const theme = useMantineTheme();


    const featuresData = [
        {
            title: '24/7 Availability',
            description:
                'Enjoy round-the-clock assistance for all your travel needs, ensuring support whenever and wherever you need it.',
            icon: IconClock24,
        },
        {
            title: 'Travel with a Local',
            description:
                'Get insights about local events and festivals happening during your trip to enhance your experience.',
            icon: IconHeartHandshake,
        },
        {
            title: 'Get Entry Requirements',
            description:
                'Stay informed about visa requirements and entry regulations for your travel destinations.',
            icon: IconWorldLongitude,
        },
    ];

    const features = featuresData.map((feature) => (
        <Grid.Col span={4}>
            <Card key={feature.title} h={"100%"} shadow="md" radius="md" padding="sm">
                <feature.icon
                    style={{width: rem(48), height: rem(48)}}
                    stroke={1.25}
                    color={theme.colors.green[6]}
                />
                <Text fz="md" fw={500} className={classes.cardTitle} mt="sm">
                    {feature.title}
                </Text>
                <Text fz="sm" c="dimmed" mt="sm" visibleFrom='sm'>
                    {feature.description}
                </Text>
            </Card>
        </Grid.Col>
    ));


    return (<>

        <Stack h={"100%"} justify='center'>


            <Center>
                <Group>
                    <Avatar
                        src={Travy}
                        size={'xl'}
                    />

                    <div style={{flex: 1}}>
                        <Text size="lg">
                            Meet <span style={{fontWeight: 700}}>Travy</span>
                        </Text>

                        <Text c="dimmed" size="md" fw={400}>
                            Your Personal Travel Agent
                        </Text>
                    </div>
                </Group>
            </Center>

            <Grid align='stretch'>
                {features}
            </Grid>


        </Stack>
    </>);

}

export default WelcomeDisplay;
