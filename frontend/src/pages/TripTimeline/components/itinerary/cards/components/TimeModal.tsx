import {ActionIcon, Button, Container, Group, Modal, rem} from "@mantine/core";
import {DatePickerInput, DatesProvider, TimeInput} from "@mantine/dates";
import {useForm} from "@mantine/form";
import {IconX} from "@tabler/icons-react";
import {useSocket} from "../../../../../../hooks/UseSocket";
import * as Y from 'yjs';
import {convertWithTimezone, formatTime, isNormalizedTime, normalizeToUTC} from "./utils";


interface TimeModalProps {
    date?: {
        start?: Date;
        end?: Date;
    };
    previousEndTime?: Date;
    timezone?: string;
    name: string;
    index: number;
    opened: boolean;
    close: () => void;
}

const TimeModal: React.FC<TimeModalProps> = ({date, timezone, previousEndTime, opened, name, index, close}) => {

    const {socket, yarray, ydoc} = useSocket();


    const setTimeForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            startDay: (date?.start && !isNormalizedTime(date.start)) ? date.start : null,
            startTime: date?.start ? formatTime(date.start, timezone) : null,
            endDay: (date?.end && !isNormalizedTime(date.end)) ? date.end : null,
            endTime: date?.end ? formatTime(date.end, timezone) : null,
        },
        validate: (values) => {
            // endTime must be after startTime

            if (values.startDay && values.endDay && (values.startDay.getDate() > values.endDay.getDate())) {
                return {endDay: 'End date must be after start date'};
            }

            if (!values.startDay || !values.endDay) {
                if (values.startTime && values.endTime && values.startTime > values.endTime) {
                    return {endTime: 'End time must be after start time'};
                }
            }


            return {}
        }
    });


    const handleSubmit = (values: {
        startDay: Date | null,
        startTime: string | null,
        endDay: Date | null,
        endTime: string | null
    }) => {

        // !!! figure out what to do if timezone is not available

        let startRetVal: Date | undefined = undefined;
        let endRetVal: Date | undefined = undefined;

        if (values.startTime !== null) {

            if (values.startDay) {
                startRetVal = convertWithTimezone(values.startDay, values.startTime);
            } else {
                startRetVal = normalizeToUTC(values.startTime, timezone || 'America/Vancouver');
            }

            console.log('startTime:', startRetVal);
        }

        if (values.endTime !== null) {

            if (values.endDay) {
                endRetVal = convertWithTimezone(values.endDay, values.endTime);
            } else {
                endRetVal = normalizeToUTC(values.endTime, timezone || 'America/Vancouver');
            }

            console.log('endTime:', endRetVal);
        }

        const newDate = {
            start: startRetVal ? startRetVal.toISOString() : undefined,
            end: endRetVal ? endRetVal.toISOString() : undefined
        }

        const item = yarray.get(index);
        yarray.delete(index, 1);
        yarray.insert(index, [{...item, date: newDate}]);

        if (socket) {
            socket.emit('updateList', Y.encodeStateAsUpdate(ydoc));
        }

        // close modal
        close();
    };


    return (
        <>
            <Modal opened={opened} onClose={close} title={`Set Time for ${name}`} centered>
                <Container w={"85%"}>

                    <DatesProvider settings={{timezone: timezone}}>
                        <form onSubmit={setTimeForm.onSubmit((values) => handleSubmit(values))}>
                            <DatePickerInput
                                radius="xl"
                                minDate={previousEndTime}
                                clearable
                                label="Start Date"
                                placeholder="Start Date"
                                key={setTimeForm.key('startDay')}
                                {...setTimeForm.getInputProps('startDay')}
                            />
                            <TimeInput
                                radius="xl"
                                label="Start Time"
                                key={setTimeForm.key('startTime')}
                                minTime={(previousEndTime && !isNormalizedTime(previousEndTime)) ? formatTime(previousEndTime, timezone) : undefined}
                                {...setTimeForm.getInputProps('startTime')}
                                rightSection={
                                    <ActionIcon size={32} radius="xl" color="grey" variant="transparent"
                                                onClick={() => setTimeForm.setFieldValue('startTime', null)}
                                                style={{display: setTimeForm.values.startTime ? 'block' : 'none'}}>
                                        <IconX style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                                    </ActionIcon>
                                }
                            />
                            <DatePickerInput
                                radius="xl"
                                label="End Date"
                                clearable
                                placeholder="End Date"
                                key={setTimeForm.key('endDay')}
                                {...setTimeForm.getInputProps('endDay')}
                            />
                            <TimeInput
                                radius="xl"
                                label="End Time"
                                key={setTimeForm.key('endTime')}
                                rightSection={
                                    <ActionIcon size={32} radius="xl" color="grey" variant="transparent"
                                                onClick={() => setTimeForm.setFieldValue('endTime', null)}
                                                style={{display: setTimeForm.values.endTime ? 'block' : 'none'}}>
                                        <IconX style={{width: rem(18), height: rem(18)}} stroke={1.5}/>
                                    </ActionIcon>
                                }
                                {...setTimeForm.getInputProps('endTime')}
                            />
                            <Group justify="flex-end" mt="md">
                                <Button type="submit" variant="filled" color="lime" radius="xl">Set Time</Button>
                            </Group>
                        </form>


                    </DatesProvider>
                </Container>
            </Modal>
        </>
    );
}

export default TimeModal;
