import { Group, Text, List, rem, ThemeIcon, Title, Tooltip } from '@mantine/core';
import { DonutChart } from '@mantine/charts';
import { BudgetCategory } from '@trek-types/trip.ts';
import { getColorForCategory, getIconForCategory } from '@utils/budget.ts';

export interface CostChartProps {
    chartName: string;
    legendTitle: string;
    currency: string;
    data: {
        name: BudgetCategory;
        value: number;
    }[];
}

const CostChart = ({ chartName, legendTitle, data, currency }: CostChartProps) => {

    const chartData = data && data.map((item) => {
        return {
            name: item.name,
            value: item.value,
            color: getColorForCategory(item.name)


        }
    });

    // total cost
    const totalCost = chartData.reduce((acc, item) => acc + item.value, 0);
    // to string up to 2 decimal places
    const totalCostString = totalCost.toFixed(2) + " " + currency;

    const listItems = data.map((item) => {
        const name = item.name;
        const CategoryIcon = getIconForCategory(name);
        return (
            <List.Item
                key={name}
                icon={<Tooltip label={name}>
                    <ThemeIcon color={getColorForCategory(item.name)} size={24} radius="xl">
                        <CategoryIcon style={{ width: rem(16), height: rem(16) }} />
                    </ThemeIcon>
                </Tooltip>}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Text>{item.value.toFixed(2) + " " + currency}</Text>
                </div>
            </List.Item>
        );
    });

    return (
        <Group gap={50}>
            <div>
                <DonutChart data={chartData} chartLabel={`${chartName}`} withTooltip={false} mx="auto" pieProps={{ isAnimationActive: true, dataKey: "value" }} />
            </div>

            <div>
                <Title order={5}>{legendTitle}</Title>
                <List>
                    {listItems}
                </List>
                <Title order={6}>Total: {totalCostString}</Title>
            </div>
        </Group>
    );
}

export default CostChart
