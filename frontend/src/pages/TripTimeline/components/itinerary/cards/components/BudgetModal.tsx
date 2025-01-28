import {Avatar, Box, Button, Group, Modal, Select, Text} from "@mantine/core";
import {useEffect, useMemo, useState} from 'react';
import {
    MRT_Cell,
    MRT_ColumnDef,
    MRT_Table,
    useMantineReactTable,
} from 'mantine-react-table';
import CurrencyAutocomplete from "@components/input-selects/CurrencyAutocomplete";
import {Budget, GroupMemberBudget} from "@trek-types/trip-item/tripItem";
import {useSocket} from "../../../../../../hooks/UseSocket";
import * as Y from 'yjs';
import {BudgetCategory} from "@trek-types/trip";
import {useSelector} from "react-redux";
import {selectTrip} from "../../../../../../redux/selector/tripSelector";
import {useParams} from "react-router-dom";
import {BasicUser} from "@trek-types/user";
import {formatCurrency} from "@utils/currency";

interface BudgetModalProps {
    /** The name of the Destination */
    name: string;
    budget?: Budget;
    index: number;
    opened: boolean;
    open: () => void;
    close: () => void;
}

interface BudgetRecord {
    sub: string;
    name: string;
    image: string;
    estimatedCost: number;
    actualCost: number;
    payment: number;
}


const BudgetModal: React.FC<BudgetModalProps> = ({name, budget, opened, index, close}) => {


    const {socket, yarray, ydoc} = useSocket();
    const tripUUID = useParams().uuid || "";
    const tripMembers: BasicUser[] = (useSelector(selectTrip(tripUUID))?.nonOwnerUsers || []) as BasicUser[];
    const baseCurrency: string = (useSelector(selectTrip(tripUUID))?.budget?.baseCurrency || 'CAD') as string;
    const [selectedCurrency, setSelectedCurrency] = useState<string>(budget?.currency || 'CAD');
    const [selectedBudgetCategory, setSelectedBudgetCategory] = useState<BudgetCategory>(budget?.category || 'Other');

    const budgetRecords = useMemo(() => {
        // Convert budget to BudgetRecord
        return budget?.membersBudget.map((memberBudget: GroupMemberBudget) => {
            const member = tripMembers.find((member: BasicUser) => member.sub === memberBudget.member);
            if (!member) return null;

            return {
                sub: member.sub,
                name: member.name,
                image: (member.uploadedProfilePictureURL && member.uploadedProfilePictureURL !== "") ? member.uploadedProfilePictureURL : member.image,
                estimatedCost: memberBudget.estimated_cost,
                actualCost: memberBudget.cost,
                payment: memberBudget.paid_cost,
            } as BudgetRecord;
        }).filter((record: BudgetRecord | null): record is BudgetRecord => record !== null) || [];
    }, [budget, tripMembers]);

    // add missing members to budgetRecords
    if (budgetRecords.length !== tripMembers.length) {
        console.log("adding missing members to budgetRecords \n", budgetRecords.length, tripMembers.length);
        tripMembers.forEach((member: BasicUser) => {
            const memberExists = budgetRecords.find((record: BudgetRecord) => record.name === member.name);
            if (!memberExists) {
                budgetRecords.push({
                    sub: member.sub,
                    name: member.name,
                    image: (member.uploadedProfilePictureURL && member.uploadedProfilePictureURL !== "") ? member.uploadedProfilePictureURL : member.image,
                    estimatedCost: 0,
                    actualCost: 0,
                    payment: 0,
                });
            }
        });
    }

    const uri = import.meta.env.PROD ? window.location.origin : "http://localhost:3000";
    const [conversionRate, setConversionRate] = useState<number>(1);
    const [tableData, setTableData] = useState<BudgetRecord[]>([]);

    useEffect(() => {
        const fetchConversionRate = async () => {
            try {
                const response = await fetch(`${uri}/api/v1/budget/currency`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        from: selectedCurrency,
                        to: baseCurrency,
                        amount: 1
                    })
                });
                const data = await response.json();
                setConversionRate(data.amount);
            } catch (error) {
                console.error('Error fetching conversion rate:', error);
            }
        };

        fetchConversionRate();
    }, [selectedCurrency, baseCurrency]);

    useEffect(() => {
        if (opened) {
            setTableData(budgetRecords);
        }
    }, [budgetRecords, opened]);

    const totalEstimatedCost = useMemo(() => {
        return tableData.reduce((acc, row) => acc + row.estimatedCost, 0);
    }, [tableData]);

    const totalActualCost = useMemo(() => {
        return tableData.reduce((acc, row) => acc + row.actualCost, 0);
    }, [tableData]);

    const totalPayment = useMemo(() => {
        return tableData.reduce((acc, row) => acc + row.payment, 0);
    }, [tableData]);

    const columns = useMemo<MRT_ColumnDef<BudgetRecord>[]>(
        () => [
            {
                header: 'Travellor',
                accessorKey: 'name',
                enableEditing: false,
                minSize: 230,
                Cell: ({cell, row}) => {
                    return (
                        <Group gap="sm">
                            <Avatar size={40} src={row.original.image} radius={40}/>
                            <div>
                                <Text fz="sm" fw={500}>
                                    {cell.getValue<string>()}
                                </Text>
                            </div>
                        </Group>)
                },
                Footer: () => <div>Total</div>
            },
            {
                accessorKey: 'estimatedCost',
                header: `Estimated Cost (${selectedCurrency})`,
                enableEditing: true,
                mantineEditTextInputProps: {
                    type: 'number',
                    rightSection: <Text>{selectedCurrency}</Text>
                },
                mantineTableHeadCellProps: {
                    align: 'right',
                },
                mantineTableBodyCellProps: {
                    align: 'right',
                },
                Footer: () => <div>{formatCurrency(totalEstimatedCost, selectedCurrency)}</div>
            },
            {
                accessorKey: 'actualCost',
                header: `Actual Cost (${selectedCurrency})`,
                enableEditing: true,
                mantineEditTextInputProps: {
                    type: 'number',
                    rightSection: <Text>{selectedCurrency}</Text>
                },
                mantineTableHeadCellProps: {
                    align: 'right',
                },
                mantineTableBodyCellProps: {
                    align: 'right',
                },
                Footer: () => <div>{formatCurrency(totalActualCost, selectedCurrency)}</div>
            },
            {
                accessorKey: 'payment',
                header: `Payment (${selectedCurrency})`,
                enableEditing: true,
                mantineEditTextInputProps: {
                    type: 'number',
                    rightSection: <Text>{selectedCurrency}</Text>
                },
                mantineTableHeadCellProps: {
                    align: 'right',
                },
                mantineTableBodyCellProps: {
                    align: 'right',
                },
                Footer: () => {

                    const diff = totalActualCost ? (totalActualCost - totalPayment) : (totalEstimatedCost - totalPayment);

                    return (
                        <Box c={diff > 0 ? '#FFBA38' : (diff === 0 ? 'green' : 'red')}>
                            <div>
                                {formatCurrency(totalPayment, selectedCurrency)}
                            </div>
                        </Box>
                    );
                }
            }
        ],
        [selectedCurrency, totalEstimatedCost, totalActualCost, totalPayment],
    );


    const handleSaveCell = (cell: MRT_Cell<BudgetRecord>, value: string | number) => {

        console.log(value);
        value = typeof value === 'string' ? parseFloat(value) : value;


        if (cell.column.id === 'estimatedCost' && typeof value === 'number') {
            tableData[cell.row.index]['estimatedCost'] = value || 0;
        } else if (cell.column.id === 'actualCost' && typeof value === 'number') {
            tableData[cell.row.index]['actualCost'] = value || 0;
        } else if (cell.column.id === 'payment' && typeof value === 'number') {
            tableData[cell.row.index]['payment'] = value || 0;
        }
        //send/receive api updates here
        setTableData([...tableData]); //re-render with new data
    };

    const editTextInput = ({cell}: { cell: MRT_Cell<BudgetRecord> }) => ({
        //onBlur is more efficient, but could use onChange instead
        onBlur: (event: { target: { value: string; }; }) => {
            handleSaveCell(cell, event.target.value);
        },
        variant: 'unstyled', //default for editDisplayMode="table"
    })

    const table = useMantineReactTable({
        columns: columns,
        data: tableData,
        editDisplayMode: "table",
        enableEditing: true,
        enableStickyHeader: true,
        mantineEditTextInputProps: editTextInput,
        enableColumnActions: false,
        enableColumnFilters: false,
        enablePagination: false,
        enableSorting: false,
        mantineTableProps: {
            highlightOnHover: false,
            striped: false,
            withColumnBorders: false,
            withRowBorders: true,
            withTableBorder: false,
        },
        initialState: {density: 'xs'}
    });

    const handleSubmit = () => {

        console.log("saving: ", tableData);

        //send/receive api updates here

        // map budgetRecords to GroupMemberBudget
        const groupMemberBudgets: GroupMemberBudget[] = tableData.map((record: BudgetRecord) => {
            return {
                member: record.sub,
                estimated_cost: record.estimatedCost || 0,
                cost: record.actualCost || 0,
                paid_cost: record.payment || 0,
                estimated_cost_base_currency_amount: (record.estimatedCost || 0) * conversionRate,
                cost_base_currency_amount: (record.actualCost || 0) * conversionRate,
                payment_base_currency_amount: (record.payment || 0) * conversionRate
            }
        });

        const item = yarray.get(index);

        // total cost is the sum of all member costs (if 0, then it's the sum of all estimated costs)
        const totalCost = groupMemberBudgets.reduce((sum, item) => {
            return sum + (item.cost_base_currency_amount !== 0 ? item.cost_base_currency_amount : (item.estimated_cost_base_currency_amount || 0));
        }, 0);


        console.log("Total Cost is ", totalCost);

        const newBudget: Budget = {
            currency: selectedCurrency,
            category: selectedBudgetCategory || 'Other',
            totalCost: totalCost || 0,
            totalPaidCost: groupMemberBudgets.reduce((acc, curr) => acc + (curr.payment_base_currency_amount || 0), 0),
            membersBudget: groupMemberBudgets
        }

        yarray.delete(index, 1);
        yarray.insert(index, [{...item, budget: newBudget}]);

        if (socket) {
            socket.emit('updateList', Y.encodeStateAsUpdate(ydoc));
        }


        close();
    }


    return (
        <>
            <Modal opened={opened} onClose={close} title={`Budget For ${name}`} size={'auto'} centered>

                <MRT_Table table={table}/>

                <Group justify="space-between" mt="md">
                    <Group>
                        <Select
                            label="Budget Category"
                            placeholder="Pick Category"
                            value={selectedBudgetCategory}
                            onChange={(value) => setSelectedBudgetCategory((value || 'Other') as BudgetCategory)}
                            allowDeselect={false}
                            data={["Activities", "Accommodation", "Food and Restaurants", "Transportation", "Gifts and Souvenirs", "Other"]}
                        />
                        <CurrencyAutocomplete label={"Choose Budget Currency"} value={selectedCurrency}
                                              setValue={setSelectedCurrency}/>

                    </Group>
                    <Button type="submit"
                            disabled={(totalActualCost ? (totalActualCost - totalPayment) : (totalEstimatedCost - totalPayment)) < 0}
                            onClick={handleSubmit} variant="filled" color="lime" radius="xl">Set Budget</Button>
                </Group>

            </Modal>
        </>
    );
}

export default BudgetModal;

