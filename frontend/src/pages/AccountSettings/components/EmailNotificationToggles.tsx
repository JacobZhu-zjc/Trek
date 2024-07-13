import { Card, Group, Switch, Text } from '@mantine/core';
import classes from './SwitchesCard.module.css';
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {getUserSettingsAsync, putUserSettingsAsync} from "../../../redux/users/thunks.ts";
import {Settings, User} from '../../../interfaces.ts';
import {AppDispatch} from '../../../redux/store.ts';

const EmailNotificationToggles = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        dispatch(getUserSettingsAsync());
    }, []);

    const account = useSelector((state: {user: {settings: Settings}}) => state.user.settings);
    const username = useSelector((state: {user: {self: User}}) => state.user.self.username);
    const data = [
        {
            title: 'Limited Time Travel Deals',
            description: 'Be the first to know limited time travel deals!',
            stateKey: 'accountLimitedDeals'
        },
        {
            title: 'Travel Newsletter',
            description: 'Recommendations for best travel tips by us and the community.',
            stateKey: 'accountNewsletterNotifications'
        },
    ];

    function handleSwitchChange(stateKey: string) {
        const newSettings: Settings = {
            privateAccount: false,
            accountLimitedDeals: account.accountLimitedDeals,
            accountNewsletterNotifications: account.accountNewsletterNotifications
        }
        newSettings[stateKey] = !newSettings[stateKey];

        dispatch(putUserSettingsAsync({username: username, settings: newSettings}));
    }

    const items = data.map((item) => {
        return (
            <Group justify="space-between" className={classes.item} wrap="nowrap" gap="xl" key={item.title}>
                <div>
                    <Text>{item.title}</Text>
                    <Text size="xs" c="dimmed">
                        {item.description}
                    </Text>
                </div>
                <Switch checked={account[item.stateKey as string]} onLabel="ON" offLabel="OFF" className={classes.switch}
                        onChange={() => handleSwitchChange(item.stateKey)} size="lg"/>
            </Group>
        );
    });


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
