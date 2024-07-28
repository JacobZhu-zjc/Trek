import classes from "./Forms.module.css";
import {Box, NumberInput, rem, Select, ThemeIcon, Tooltip} from "@mantine/core";
import {getColorForCategory, getIconForCategory} from "@utils/budget.ts";

const BudgetForm = () => {
    const categories = ['Activities', 'Accommodation', 'Food and Restaurants', 'Transportation', 'Gifts and Souvenirs', 'Other'];
    const inputs = categories.map(category => {
        const CategoryIcon = getIconForCategory(category);
        const leftSection = (
            <Tooltip label={category}>
                <ThemeIcon color={getColorForCategory(category)} size={24} radius="xl">
                    <CategoryIcon style={{ width: rem(16), height: rem(16) }} />
                </ThemeIcon>
            </Tooltip>
        );
        return (
            <NumberInput
                leftSection={leftSection}
                className={classes.input}
                placeholder={category}
                style={{width: "50%"}} />
        );
    });
    return (
        <Box className={classes.spacer}>
            <h2 className={classes.title}>Budget</h2>
            <Box style={{width: "calc(100%)"}}>
                <Select
                    label="Currency"
                    placeholder="Select your preferred currency"
                    data={['CAD', 'USD', 'CNY', 'JPY', 'KRW', 'EUR', 'GBP']}
                    className={classes.input}
                    style={{width: "50%"}} />

                {inputs}
            </Box>
        </Box>
    );
}

export default BudgetForm
