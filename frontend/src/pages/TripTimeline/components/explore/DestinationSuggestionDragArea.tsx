import cx from 'clsx';
import { Flex, Text, Image } from '@mantine/core';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import classes from './DndList.module.css';
import { DestinationSuggestionItem } from '../../types';


interface DestinationSuggestionDragAreaProps {
    suggestionData: DestinationSuggestionItem[];
}

export const DestinationSuggestionDragArea = ({ suggestionData }: DestinationSuggestionDragAreaProps) => {

    const renderDestinationSuggestionItem = (item: DestinationSuggestionItem, index: number) => (
        <>
            <Draggable key={item.id} index={index} draggableId={item.id.toString()}>
                {(provided, snapshot) => (
                    <div
                        className={`${cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })} bg-slate-50`}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                    >
                        <Flex
                            gap="md"
                            justify="flex-start"
                            align="center"
                            direction="row"
                            wrap="wrap">

                            <Image radius="md" h={100} maw={150} src={item.imageUrl} />

                            <div>
                                <Text>{item.name}</Text>
                                <Text c="dimmed" size="sm" lineClamp={3}>
                                    {item.description}
                                </Text>
                            </div>

                        </Flex>
                    </div>
                )}
            </Draggable>
        </>
    );

    const items = suggestionData.map((item: DestinationSuggestionItem, index) => (
        renderDestinationSuggestionItem(item, index)
    ));

    return (

        <Droppable droppableId="suggestion" direction="vertical">
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                    {items}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>

    );
}