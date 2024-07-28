import { Title, Text, Container, Overlay, Box, Stack, Group, Anchor } from '@mantine/core';
import classes from './index.module.css';
import { Destination } from '@trek-types/payload-types';

export interface HeroProps {
  name: string;
  main_photo: Destination['properties']['main_photo'];
}

export function Hero({ name, main_photo }: HeroProps) {


  return (
    <Box className={classes.wrapper}
      style={{
        backgroundImage: (main_photo && typeof main_photo === "object" && main_photo.sizes?.tablet?.url)
          ? `url('http://localhost:3000${main_photo.sizes.tablet.url}')` : ''
      }}
      pt={100}
      w={"100vw"}>
      <Overlay color="#000" opacity={0.65} zIndex={1} />

      <div className={classes.inner}>
        <Stack justify='center' align='center'>

          <Title size={"7.5rem"} c={"white"}>
            {name}
          </Title>

          <Container size={640}>
            <Text size="lg" className={classes.description}>
              The Ultimate Travel Guide to {name}
            </Text>
          </Container>
        </Stack>
      </div>
      <Group justify="right" pt={100}>
        {(main_photo && typeof main_photo === "object" && main_photo.sizes?.tablet?.url) ?
          (<Text c={"dimmed"} className='z-10'>
            <Anchor c={"dimmed"} href={main_photo.license_url || ''}>{main_photo.license?.toUpperCase()}</Anchor>
            - {main_photo.artist}
          </Text>) :
          <></>}
      </Group>

    </Box >

  );
}