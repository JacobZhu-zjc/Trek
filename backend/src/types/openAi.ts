export interface Message {
    sub: string;
    tripUUID: string;
    text: string,
    sender: string,
    timestamp: Date,
    destinations: string[],
}
