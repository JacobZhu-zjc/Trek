import {useListState, UseListStateHandlers} from '@mantine/hooks';
import {SerializedTripItem, TripItem} from '@trek-types/trip-item/tripItem';
import {deserializeTripItems} from '@utils/tripItem';
import React, {createContext, useEffect, useState} from 'react';
import io, {Socket} from 'socket.io-client';
import * as Y from 'yjs';

interface SocketContextType {
    socket: Socket | null;
    itemList: TripItem[];
    handler: UseListStateHandlers<TripItem>;
    isConnected: boolean;
    yarray: Y.Array<SerializedTripItem>;
    ydoc: Y.Doc;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider: React.FC<{ url: string; room: string; children: React.ReactNode }> = ({
                                                                                                       url,
                                                                                                       room,
                                                                                                       children
                                                                                                   }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
    const [ydoc] = useState(() => new Y.Doc());
    const yarray = ydoc.getArray<SerializedTripItem>('items');
    const [itemList, handler] = useListState<TripItem>([]);

    useEffect(() => {
        const newSocket = io(url);
        setSocket(newSocket);

        newSocket.on('connect', () => {
            console.log('Connected to socket');
            newSocket.emit('joinRoom', room);
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from socket');
            setIsConnected(false);
        });

        newSocket.on("initialList", (update: Uint8Array) => {
            console.log('Initial list received');
            Y.applyUpdate(ydoc, new Uint8Array(update));
            handler.setState(deserializeTripItems(yarray.toArray()));
        });

        newSocket.on("updateList", (update: Uint8Array) => {
            console.log("Update received");
            Y.applyUpdate(ydoc, new Uint8Array(update));
            handler.setState(deserializeTripItems(yarray.toArray()));
        });

        newSocket.on("addItem", (update: Uint8Array) => {
            console.log("Add received");
            Y.applyUpdate(ydoc, new Uint8Array(update));
            handler.setState(deserializeTripItems(yarray.toArray()));
        });

        return () => {
            newSocket.disconnect();
        };

    }, [url, room]);


    return (
        <SocketContext.Provider value={{socket, itemList, handler, isConnected, yarray, ydoc}}>
            {children}
        </SocketContext.Provider>
    );
};

export default SocketContext;
