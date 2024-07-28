import { Group, Text, List, rem, ThemeIcon, Title, Tooltip } from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import { IconCheck, IconReceipt2 } from '@tabler/icons-react';

export interface PaymentChartProps {
    currency: string;
    data: {
        name: string;
        value: number;
    }[];
}

const PaymentChart = ({ data, currency }: PaymentChartProps) => {
    const filteredPaid = (data.filter(item => item.name === "Paid") || [{ name: "Paid", value: 0 }])[0];
    const filteredUnpaidData = (data.filter(item => item.name === "Unpaid") || [{ name: "Unpaid", value: 0 }])[0];

    const paidData = filteredPaid.value ? filteredPaid : {name: "", value: 0};
    const unpaidData = filteredUnpaidData.value ? filteredUnpaidData : {name: "", value: 0};

    const chartData = data
        .map((item) => {
            if (item.name === "Paid") {
                return { ...item, color: '#0CAF49' };
            }
            else {
                return { ...item, color: 'gray.6' };
            }
        });

    // total cost
    const totalCost = (paidData ? paidData.value : 0) + (unpaidData ? unpaidData.value : 0);
    // to string up to 2 decimal places
    const totalCostString = totalCost.toFixed(2) + " " + currency;

    return (
        <Group gap={50}>
            <div>
                <DonutChart data={chartData} chartLabel={`Paid Costs`} withTooltip={false} mx="auto" pieProps={{ isAnimationActive: true, dataKey: "value" }} />
            </div>

            <div>
                <Title order={5}>{'Paid Trip Costs'}</Title>
                <List>
                    <List.Item
                        key={"Paid"}
                        icon={<Tooltip label={'Paid'}>
                            <ThemeIcon color={'#0CAF49'} size={24} radius="xl">
                                <IconCheck style={{ width: rem(16), height: rem(16) }} />
                            </ThemeIcon>
                        </Tooltip>}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Text>{(paidData.value).toFixed(2) + " " + currency}</Text>
                        </div>
                    </List.Item>
                    <List.Item
                        key={"Unpaid"}
                        icon={<Tooltip label={'Unpaid'}>
                            <ThemeIcon color={'gray.6'} size={24} radius="xl">
                                <IconReceipt2 style={{ width: rem(16), height: rem(16) }} />
                            </ThemeIcon>
                        </Tooltip>}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <Text>{unpaidData.value.toFixed(2) + " " + currency}</Text>
                        </div>
                    </List.Item>
                </List>
                <Title order={6}>Total: {totalCostString}</Title>
            </div>
        </Group>
    );
}

export default PaymentChart