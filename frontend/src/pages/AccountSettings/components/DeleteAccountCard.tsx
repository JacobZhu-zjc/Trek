import { Text, Card, Button } from '@mantine/core';
import classes from './UserInfoIcons.module.css';
import { modals } from '@mantine/modals';

function DeleteAccountCard() {


    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: 'Delete your profile',
            centered: true,
            children: (
                <Text size="sm">
                    Are you sure you want to delete your profile? Once you delete it, all your data will be lost.
                </Text>
            ),
            labels: { confirm: 'Delete account', cancel: "No don't delete it" },
            confirmProps: { color: 'red' },
            onCancel: () => console.log('Cancel'),
            onConfirm: () => console.log('Confirmed'),
        });

    return (
        <Card withBorder radius="md" p="xl" w={"100%"} className={classes.card}>
            <div>
                <Text fz="lg" fw={'bold'} className={classes.name}>
                    DELETE ACCOUNT
                </Text>

                <Text fz="xs" tt="uppercase" fw={700} c="dimmed">
                    This action is irreversible
                </Text>


                <Button mt="50px" onClick={openDeleteModal} color="red">Delete account</Button>
            </div>

        </Card>
    );
}

export default DeleteAccountCard;