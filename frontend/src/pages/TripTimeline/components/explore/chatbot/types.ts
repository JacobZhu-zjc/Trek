export interface Message {
    id: number;
    text: string;
    sender: 'user' | 'bot';
    timestamp: Date;
}

export interface StreamingMessage {
    id: number;
    stream: ReadableStream<Uint8Array>;
    sender: 'bot';
    timestamp: Date;
}