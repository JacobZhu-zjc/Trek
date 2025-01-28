import {Container, Paper, Text} from "@mantine/core";
import DestinationCard from "../../../../../../components/cards/destination-card/DestinationCard";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import classes from './markdownRenderer.module.css';
import {Destination} from "@trek-types/destination";
import {Draggable, Droppable} from "@hello-pangea/dnd";

interface BotMessageBubbleProps {
    text: string;
    destinations?: Destination[];
    id?: number;
}

const BotMessageBubble: React.FC<BotMessageBubbleProps> = ({text, destinations, id}) => {


    const items = destinations?.map((destination, index) => (
        <div key={index} className="my-3">
            <Draggable key={`${Date.now().toString()}-${destination.id}-${index}-${id}`} index={index}
                       draggableId={`${destination.id}-${Date.now().toString()}`}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="my-[30]"
                    >
                        <DestinationCard destination={destination}/>
                    </div>
                )}
            </Draggable>
        </div>
    ));

    /**
     * replaceBracketsWithDestinationName
     *
     * @param message from the OpenAI API response
     * @returns string message with square brackets and content replaced by empty strings
     *          ignores square brackets without a "||" separator
     *          Country code must be 2 characters long (excluding whitespaces)
     */
    const replaceBracketsWithDestinationName = (message: string): string => {
        // Use a regular expression to match text between square brackets with "||" separator
        const regex = /\[([^|\]]+)\|\|(\S{2})\]/g;

        // Replace matches with empty strings
        return message.replace(regex, '');
    };


    return (<>
        <Paper shadow="xs" radius="lg" p="md">
            <Text size="sm" mb={5}>Travy:</Text>
            <div className={classes.markdown + " font-lexend"}>
                {/* Text from ChatGPT */}
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{replaceBracketsWithDestinationName(text)}</ReactMarkdown>
            </div>
            <Container p={0} mt={10}>
                <Droppable droppableId={`travy-${Date.now().toString()}-${id}`} direction="vertical">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} style={{height: "100%"}}>
                            {items}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </Container>
        </Paper>
    </>);
}

export default BotMessageBubble;
