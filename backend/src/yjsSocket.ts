import {Application} from "express";
import {Server} from "socket.io";
import http from "http";
import * as Y from 'yjs';
import {fetchTripItemsFromDatabase, pushTripItemsToDatabase} from "./utils/trip";
import {randomUUID} from "crypto";


export default function addYjsSocket(origApp: Application) {


    type RoomDocuments = Record<string, Y.Doc>;
    type UserCounts = Record<string, number>;

    const roomDocuments: RoomDocuments = {}; // In-memory Yjs documents per room
    const userCounts: UserCounts = {}; // Track number of users per room

    const server = http.createServer(origApp);
    const io = new Server(server, {
        path: '/socket.io',
        cors: {
            origin: '*', // Adjust according to your needs
            methods: ["GET", "POST"]
        }
    });

    const tripCollabPath = '/tripItemCollaboration';


    io.of(tripCollabPath).on('connection', (socket) => {
        console.log('A user connected:', socket.id);

        socket.on('joinRoom', async (roomId: string) => {
            try {
                socket.join(roomId)
                socket.data.roomId = roomId;
                console.log(`User ${socket.id} joined room ${roomId}`);

                // Initialize room document if it doesn't exist
                if (!roomDocuments[roomId]) {
                    const latestState = await fetchTripItemsFromDatabase(roomId);
                    roomDocuments[roomId] = latestState;
                    userCounts[roomId] = 0;
                }


                userCounts[roomId]++;

                const initialData = Y.encodeStateAsUpdate(roomDocuments[roomId]);
                socket.emit('initialList', initialData);

            } catch (error: any) {
                console.error(`Error joining room ${roomId}:`, error.message);
            }
        });

        // Leave a room
        socket.on('leaveRoom', (room) => {
            try {
                socket.leave(room);
                console.log(`User ${socket.id} left room ${room}`);
            } catch (error: any) {
                console.error(`Error leaving room ${room}:`, error.message);
            }
        });

        socket.on('updateList', (update) => {
            try {
                const roomId = socket.data.roomId;
                const namespace = io.of(tripCollabPath);
                const roomSize = namespace.adapter.rooms.get(roomId)?.size;

                const users = io.sockets.adapter.rooms.get(roomId);
                console.log("Users in room", users);
                console.log(io.sockets.adapter.rooms.size);
                console.log(`User count in room ${roomId}: ${roomSize}`);
                if (roomDocuments[roomId]) {
                    console.log("Applying update to Yjs document");
                    Y.applyUpdate(roomDocuments[roomId], new Uint8Array(update));
                    socket.emit('updateList', update);
                    socket.to(roomId).emit('updateList', update);
                }
            } catch (error: any) {
                console.error(`Error updating list:`, error.message);
            }

        });

        socket.on('addItem', (destinationId, index, currency) => {

            try {
                console.log("in addItem");
                console.log("destinationId", destinationId);
                console.log("index", index);
                const roomId = socket.data.roomId;
                const namespace = io.of(tripCollabPath);
                const roomSize = namespace.adapter.rooms.get(roomId)?.size;
                console.log(`User count in room ${roomId}: ${roomSize}`);

                // create a new trip item and add it to the Yjs array at the specified index
                const newItem = {
                    key: randomUUID(),
                    item_id: destinationId,
                    item_type: 'destinations',
                    budget: {
                        currency: currency,
                        totalEstimatedCost: 0,
                        totalCost: 0,
                        totalPaidCost: 0,
                        membersBudget: []
                    }
                };

                if (roomDocuments[roomId]) {
                    const yArray = roomDocuments[roomId].getArray('items');
                    // insert the new item at the specified index
                    yArray.insert(index, [newItem]);
                    const update = Y.encodeStateAsUpdate(roomDocuments[roomId]);
                    socket.emit('addItem', update);
                    socket.to(roomId).emit('addItem', update);
                }
            } catch (error: any) {
                console.error(`Error adding item:`, error.message);
            }

        });


        socket.on('disconnect', async () => {

            try {

                console.log('A user disconnected:', socket.id);
                const roomId = socket.data.roomId;
                const namespace = io.of(tripCollabPath);
                const roomSize = namespace.adapter.rooms.get(roomId)?.size;
                console.log(`User count in room ${roomId}: ${roomSize}`);


                if (roomId) {
                    console.log(`User ${socket.id} left room ${roomId}`);
                    socket.leave(roomId);

                    const namespace = io.of(tripCollabPath);
                    const roomSize = namespace.adapter.rooms.get(roomId)?.size || 0;
                    console.log(`User count in room ${roomId}: ${roomSize}`);

                    if (roomSize === 0) {
                        console.log(`Room ${roomId} is empty. Persisting data to the database.`);
                        try {
                            await pushTripItemsToDatabase(roomId, roomDocuments[roomId]);
                        } catch (error: any) {
                            console.error(`Error persisting data for room ${roomId}:`, error.message);
                        }
                        console.log(`Data persisted for room ${roomId}. Cleaning up...`);
                        delete roomDocuments[roomId]; // Clean up the in-memory document
                        delete userCounts[roomId]; // Clean up user count
                    }
                }

            } catch (error: any) {
                console.error(`Error disconnecting:`, error.message);
            }

        });

    });


    return server;
}
