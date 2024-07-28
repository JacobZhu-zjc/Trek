import { Avatar, Group, MultiSelect, MultiSelectProps, Text } from "@mantine/core";
import { IconCheck } from "@tabler/icons-react";


const FilterWishlistDropdown = () => {

    const usersData: Record<string, { image: string; email: string }> = {
        'Emily Johnson': {
            image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-7.png',
            email: 'emily92@gmail.com',
        },
        'Ava Rodriguez': {
            image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-8.png',
            email: 'ava_rose@gmail.com',
        },
        'Olivia Chen': {
            image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-4.png',
            email: 'livvy_globe@gmail.com',
        },
        'Ethan Barnes': {
            image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-1.png',
            email: 'ethan_explorer@gmail.com',
        },
        'Mason Taylor': {
            image: 'https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/avatars/avatar-2.png',
            email: 'mason_musician@gmail.com',
        },
    };


    const renderMultiSelectOption: MultiSelectProps['renderOption'] = ({ option, checked }) => (
        <Group justify="space-between" w={"100%"}>
            <Group gap="sm">
                <Avatar src={usersData[option.value].image} size={36} radius="xl" opacity={checked ? "100%" : "50%"} />
                <div>
                    <Text size="sm" c={checked ? "black" : "dimmed"}>{option.value}</Text>
                    <Text size="xs" opacity={0.5}>
                        {usersData[option.value].email}
                    </Text>
                </div>
            </Group>

            {checked && <IconCheck />}
        </Group>
    );

    return (<>
        <MultiSelect
            variant="transparent"
            placeholder="Filter by User"
            data={['Emily Johnson', 'Ava Rodriguez', 'Olivia Chen', 'Ethan Barnes', 'Mason Taylor']}
            renderOption={renderMultiSelectOption}
            maxDropdownHeight={300}
            withCheckIcon={true}
            checkIconPosition="right" />
    </>);

}



export default FilterWishlistDropdown;