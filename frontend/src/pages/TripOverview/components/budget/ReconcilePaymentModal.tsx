import {Box, Button, Group, Modal, Text, Title} from "@mantine/core";
import {useState} from "react";
import {TripMemberSummary} from "../../../../hooks/ReconcileBudget";
import ReconcileBalancesComponent from "./ReconcilePaymentResult";

interface ReconcilePaymentModalProps {
    tripMemberSummary: TripMemberSummary[];
    opened: boolean;
    close: () => void;
}


const ReconcilePaymentModal: React.FC<ReconcilePaymentModalProps> = ({tripMemberSummary, opened, close}) => {


    const [activeStep, setActiveStep] = useState(1);

    const handleSubmit = () => {
        setActiveStep(2);
    }

    return (
        <>
            <Modal opened={opened} onClose={close} title={<Text
                span
                fw={700}
                size="xl"
                variant="gradient"
                gradient={{from: 'cyan', to: 'green', deg: 258}}
            >
                Trek Payment Reconciliation Tool™
            </Text>} size={'auto'} centered>

                <Box maw={800}>

                    {activeStep === 1 && (
                        <>
                            <Title order={5} mb={5}>What is Payment Reconciliation?</Title>
                            <Text>
                                The <Text
                                span
                                fw={700}
                                variant="gradient"
                                gradient={{from: 'cyan', to: 'green', deg: 258}}
                            >
                                Trek Payment Reconciliation Tool™
                            </Text> is designed to help you and your fellow travelers balance payments for shared
                                expenses during your trip.
                                This tool calculates the <Text fw={600} span>exact sequence transactions</Text> needed
                                to settle debts among trip members, ensuring that everyone pays their fair share.
                            </Text>

                            <Title order={5} mb={5} mt={20}>When should I Reconcile my Payments?</Title>
                            <Text>
                                It's best to reconcile payments after all expenses have been incurred, and the trip has
                                concluded. This ensures that no additional costs will need to be accounted for.
                            </Text>

                            <Group justify="flex-end" mt="md">
                                <Group>
                                    <Button onClick={close} variant="filled" radius={"xl"} color="gray">Cancel</Button>
                                    <Button type="submit" onClick={handleSubmit} variant="filled" color="lime"
                                            radius="xl">Reconcile Payments</Button>
                                </Group>
                            </Group>
                        </>)}

                    {activeStep === 2 && (<>
                        <ReconcileBalancesComponent tripMemberSummary={tripMemberSummary}/>
                        <Group justify="flex-end" mt="md">
                            <Group>
                                <Button type="submit" onClick={() => close()} variant="filled" color="lime"
                                        radius="xl">Done</Button>
                            </Group>
                        </Group>
                    </>)}

                </Box>

            </Modal>
        </>
    );
}

export default ReconcilePaymentModal;

