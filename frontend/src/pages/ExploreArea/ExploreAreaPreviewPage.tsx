/**
 * @file ExploreAreaPreviewPage.tsx
 * @note This is a work-in-progress
 * @author Matthew Kang
 */

import { useEffect } from "react";
import { Hero } from "./components/hero";
import { Text, Grid, Skeleton, Title, Button, Stack, Box } from "@mantine/core";
import { Carousel } from "@mantine/carousel";
import TripCard from "@components/trip-card/index";
import { KnowBeforeYouGo } from "./components/know-before";
import { ArticleCardCarousel } from "./components/article-card-carousel";
import { useLivePreview } from '@payloadcms/live-preview-react';
import { ExploreWithDestination } from "./ExploreAreaApp";



const AreaGuidePreviewApp: React.FC = () => {

    const tempExploreData: ExploreWithDestination =
    {
        "id": "temp-for-explore",
        "destination": {
            "id": "",
            "type": "Feature",
            "properties": {
                "wikipedia_url": "",
                "destination_type": "area",
                "name": "",
            },
            "createdAt": "",
            "updatedAt": ""
        },
        "description": "",
        "createdAt": "",
        "updatedAt": "",
        "slug": ""
    }


    const { data } = useLivePreview<ExploreWithDestination>({
        initialData: tempExploreData,
        serverURL: `http://localhost:3000`,
        depth: 4,
    });

    useEffect(() => {
        console.log(data);
    }, [data]);


    return (
        <>
            <Stack align="center">

                <Hero name={data.destination.properties.name} main_photo={data.destination.properties.main_photo} />

                <Box maw={1000}>
                    <Box my={100}>
                        <Grid gutter={80}>
                            <Grid.Col span={{ base: 12, md: 5 }}>
                                <Title order={2} mb={5}>
                                    {data.destination.properties.description}
                                    {/* A Hidden Gem on Vancouver Island */}
                                </Title>
                                <Text c="dimmed">
                                    {data.description}
                                    {/* From the iconic Nanaimo Bar dessert to the thrilling outdoor activities like kayaking, hiking, and the world-famous Nanaimo Bathtub Races, there's something for everyone. Wander through the historic downtown, explore the fascinating museums, and savor the fresh seafood at local restaurants. Whether you're an adrenaline junkie, a history buff, or simply looking to unwind in a picturesque setting, Nanaimo welcomes you with open arms and a myriad of experiences waiting to be discovered. */}
                                </Text>

                                <Button
                                    variant="gradient"
                                    gradient={{ deg: 133, from: 'green', to: 'lime' }}
                                    size="lg"
                                    radius="md"
                                    mt="xl"
                                >
                                    Start Planning Trip
                                </Button>
                            </Grid.Col>
                            <Grid.Col span={{ base: 12, md: 7 }}>
                                <Skeleton height={"100%"} />
                            </Grid.Col>
                        </Grid>
                    </Box>


                    <Box my={100}>
                        <Title order={2} mb={20}>{data.destination.properties.name} Travel Guides</Title>
                        <ArticleCardCarousel />
                    </Box>


                    <Box mt={50} mih={500}>
                        <KnowBeforeYouGo name={data.destination.properties.name} know_before={data.know_before} />
                    </Box>


                    <Box my={100}>
                        <Title order={2} mb={20}>Explore Trips From The Trek Community</Title>
                        <Carousel
                            withIndicators
                            slideSize={{ base: '100%', sm: '50%', md: `${100 / 4}%` }}
                            slideGap={{ base: 0, sm: 'md' }}
                            loop
                            align="start"
                        >
                            <Carousel.Slide> <TripCard /> </Carousel.Slide>
                            <Carousel.Slide> <TripCard /> </Carousel.Slide>
                            <Carousel.Slide> <TripCard /> </Carousel.Slide>
                            <Carousel.Slide> <TripCard /> </Carousel.Slide>
                            <Carousel.Slide> <TripCard /> </Carousel.Slide>
                            <Carousel.Slide> <TripCard /> </Carousel.Slide>
                            <Carousel.Slide> <TripCard /> </Carousel.Slide>
                            {/* ...other slides */}
                        </Carousel>

                    </Box>


                </Box>

            </Stack>
        </>


    )
}

export default AreaGuidePreviewApp;
