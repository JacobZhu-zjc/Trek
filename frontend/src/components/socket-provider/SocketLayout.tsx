import React from 'react';
import {Outlet, useParams} from 'react-router-dom';
import {SocketProvider} from './TripItemSocketProvider';

const SocketLayout: React.FC = () => {

    const {uuid} = useParams<{ uuid: string }>();
    const uri = import.meta.env.PROD ? window.location.origin : "http://localhost:3000";

    if (!uuid) {
        throw new Error('No UUID provided');
    }
    return (
        <SocketProvider url={`${uri}/tripItemCollaboration`} room={uuid}>
            <Outlet/>
        </SocketProvider>
    );
}

export default SocketLayout;
