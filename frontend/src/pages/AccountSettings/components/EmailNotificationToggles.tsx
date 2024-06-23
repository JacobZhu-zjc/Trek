import { Card, Group, Switch, Text } from '@mantine/core';
import classes from './SwitchesCard.module.css';
import {useSelector} from "react-redux";
import {State} from "../../../../Interfaces.ts";

const EmailNotificationToggles = () => {
    const account = useSelector((state: State) => state.account);

    const data = [
        {
            title: 'Limited Time Travel Deals',
            description: 'Be the first to know limited time travel deals!',
            state: account.accountLimitedDeals
        },
        {
            title: 'Travel Newsletter',
            description: 'Recommendations for best travel tips by us and the community.',
            state: account.accountNewsletterNotifications
        },
    ];

    const items = data.map((item) => (
        <Group justify="space-between" className={classes.item} wrap="nowrap" gap="xl" key={item.title}>
            <div>
                <Text>{item.title}</Text>
                <Text size="xs" c="dimmed">
                    {item.description}
                </Text>
            </div>
            <Switch checked={item.state} onLabel="ON" offLabel="OFF" className={classes.switch} size="lg" />
        </Group>
    ));


    return (<>
        <Card withBorder radius="md" p="xl" className={classes.card}>
            <Text fz="lg" className={classes.title} fw={500}>
                Email Notification Settings
            </Text>
            <Text fz="xs" c="dimmed" mt={3} mb="xl">
                Choose what notifications you want to receive by email
            </Text>
            {items}
        </Card>
    </>);
}

export default EmailNotificationToggles;
