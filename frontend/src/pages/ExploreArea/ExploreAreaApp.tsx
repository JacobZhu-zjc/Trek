import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Destination, Explore } from "@trek-types/payload-types";
// import { Destination } from "@trek-types/destination";
import qs from 'qs'
import { useGetExploreQuery } from "../../redux/services/payloadApi";
import TripCard from "@components/trip-card";
import { Carousel } from "@mantine/carousel";
import { Stack, Box, Grid, Title, Button, Image, LoadingOverlay, Text } from "@mantine/core";
import { ArticleCardCarousel } from "./components/article-card-carousel";
import { Hero } from "./components/hero";
import { KnowBeforeYouGo } from "./components/know-before";


/**
 * Type defined to force destination field to be destination type (Destination)
 * and not reference to destination type (string)
 */
export interface ExploreWithDestination extends Omit<Explore, 'destination'> {
    destination: Destination;
}



const ExploreAreaApp = () => {


    /** Set Page Title To "User Profile" */
    useEffect(() => {
        document.title = `Explore ${exploreData?.destination.properties.name} | Trek`;
    }, []);

    // const mapboxClient = mbxStatic({ accessToken: "pk.eyJ1IjoidHJla2tlcnMtcHJvamVjdCIsImEiOiJjbHloaXUxcTkwNDAwMnFxMG91OGpyMjdpIn0.liCJENmSeSYcYzyuvbFEvA" });


    const { slug } = useParams<{ slug: string }>();
    const [exploreData, setExploreData] = useState<ExploreWithDestination | null>(null);

    const query = {
        slug: {
            equals: slug,
        },
        depth: 4,
    }
    const stringifiedQuery = qs.stringify({ where: query }, { addQueryPrefix: true });

    const { data: dataFromQuery, error, isLoading } = useGetExploreQuery(stringifiedQuery);

    if (error) {
        console.error(error);
    }

    useEffect(() => {
        console.log(dataFromQuery);
        if (!dataFromQuery || dataFromQuery.docs.length === 0) {
            // whatever
        } else {
            setExploreData(dataFromQuery.docs[0]);
        }
    }, [dataFromQuery]);

    const imgUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/[${exploreData?.destination.properties.bbox?.min_longitude}, ${exploreData?.destination.properties.bbox?.min_latitude}, ${exploreData?.destination.properties.bbox?.max_longitude}, ${exploreData?.destination.properties.bbox?.max_latitude}]/600x500?access_token=${import.meta.env.VITE_MAPBOX_ACCESS_TOKEN}`


    return (
        <>
            <Box pos={"relative"}>
                <LoadingOverlay visible={isLoading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                {exploreData && (<Stack align="center">

                    <Hero name={exploreData.destination.properties.name} main_photo={exploreData.destination.properties.main_photo} />

                    <Box maw={1000}>
                        <Box my={100}>
                            <Grid gutter={80}>
                                <Grid.Col span={{ base: 12, md: 5 }}>
                                    <Title order={2} mb={5}>
                                        {exploreData.destination.properties.description}
                                    </Title>
                                    <Text c="dimmed">
                                        {exploreData.description}
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
                                    {/* <Skeleton height={"100%"} /> */}
                                    <Image radius={"md"} src={imgUrl} />
                                </Grid.Col>
                            </Grid>
                        </Box>


                        <Box my={100}>
                            <Title order={2} mb={20}>{exploreData.destination.properties.name} Travel Guides</Title>
                            <ArticleCardCarousel />
                        </Box>


                        <Box mt={50} mih={500}>
                            <KnowBeforeYouGo name={exploreData.destination.properties.name} know_before={exploreData.know_before} />
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

                </Stack>)}

            </Box>

        </>


    )
}

export default ExploreAreaApp;
