// export type ChatItem = Message | StreamingMessage;

import {Destination} from "@trek-types/destination";

export interface Message {
    id: number;
    text?: string | null;
    sender: 'user' | 'assistant';
    timestamp: Date;
    destinations?: Destination[];
}
