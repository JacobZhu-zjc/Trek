import {Accordion, Container, Grid, Group, Image, Text, Title} from '@mantine/core';
import classes from './index.module.css';
import {Icon, IconCoins, IconHeart, IconTrain} from '@tabler/icons-react';
import SidePhoto from '@assets/know-before-you-go.svg';
import {Explore} from '@trek-types/payload-types';


export interface KnowBeforeYouGoProps {
    name: string;
    know_before: Explore['know_before'];
}

export function KnowBeforeYouGo({name, know_before}: KnowBeforeYouGoProps) {


    const dropdownList = [
        {
            id: 'cost',
            LabelIcon: IconCoins,
            label: 'Cost',
            description: `The cost of travelling in ${name}`,
            content: know_before?.cost,
        },

        {
            id: 'transporation',
            LabelIcon: IconTrain,
            label: "Transportation",
            description: `The best way to get around in ${name}`,
            content: know_before?.transportation,
        },

        {
            id: 'safety',
            LabelIcon: IconHeart,
            label: "Safety",
            description: `How safe is it to visit ${name}?`,
            content: know_before?.safety,
        },
    ];


    interface AccordionLabelProps {
        label: string;
        LabelIcon: Icon;
        description: string;
    }

    function AccordionLabel({label, LabelIcon, description}: AccordionLabelProps) {
        return (
            <Group wrap="nowrap">
                <LabelIcon size={24} color='green'/>
                <div>
                    <Text fw={500}>{label}</Text>
                    <Text size="sm" c="dimmed" fw={400}>
                        {description}
                    </Text>
                </div>
            </Group>
        );
    }

    const items = dropdownList.filter((item) => item.content).map((item) => (
        <Accordion.Item value={item.id} key={item.label}>
            <Accordion.Control>
                <AccordionLabel {...item} />
            </Accordion.Control>
            <Accordion.Panel>
                <Text size="sm">{item.content}</Text>
            </Accordion.Panel>
        </Accordion.Item>
    ));

    return (
        <Container size="lg" w={"100%"}>
            <Grid id="faq-grid" gutter={50} grow>
                <Grid.Col span={{base: 12, md: 5}}>
                    <Image src={SidePhoto} w={"100%"}/>
                </Grid.Col>
                <Grid.Col span={{base: 12, md: 7}}>
                    <Title order={2} ta="left" className={classes.title}>
                        Know Before You Go
                    </Title>

                    <Accordion chevronPosition="right" variant="default">
                        {items}
                    </Accordion>
                </Grid.Col>
            </Grid>
        </Container>
    );
}
