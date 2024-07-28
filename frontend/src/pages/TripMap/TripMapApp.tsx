import { useContext, useEffect } from 'react';
import { RichTextEditor } from '@mantine/tiptap'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/react';
import {Tabs} from '@mantine/core';
import {IconBus, IconClock, IconMapPin, IconNotebook, IconReceipt} from '@tabler/icons-react';
import {useDispatch, useSelector} from "react-redux";
import {getTripAsync} from "../../redux/trips/thunks.ts";
import {Trip} from "@trek-types/trip.ts";
import Collaboration from '@tiptap/extension-collaboration';
import * as Y from 'yjs';
import {HocuspocusProvider} from '@hocuspocus/provider';
import {CollaborationCursor} from '@tiptap/extension-collaboration-cursor';
import {AppDispatch} from '../../redux/store.ts';
import {tripUUID} from "@trek-types/examples/sampleUUIDS.ts";
import { useAuth0 } from '@auth0/auth0-react';
import { UserContext } from '../../App.tsx';
import {useParams} from 'react-router-dom';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const uri = import.meta.env.PROD ? "wss://" + window.location.hostname : "ws://localhost:3000";

// TODO: Refactor to use Mapbox
// possibly also use destinations (consolidate locations and destinations?)
const TripMapApp = () => {
  const doc = new Y.Doc();

  const { isAuthenticated } = useAuth0();
  const userContext = useContext(UserContext);
  const uuid = useParams().uuid;

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getTripAsync({ uuid: tripUUID, token: userContext.token }));
    }
  }, [dispatch, isAuthenticated, userContext]);

  // const trip = useSelector((state: State) => state.trip);
  const trip = useSelector((state: {trip: {current: Trip}}) => state.trip.current);
  const tempLoc = useSelector((state: {trip: {current: Trip}}) => state.trip.current.map && state.trip.current.map.locations && state.trip.current.map.locations[0]);

  const {user} = useAuth0();
  // const user = "hello";

  const provider = new HocuspocusProvider({
      name: uuid ?? "",
      url: `${uri}/collaboration`,
      document: doc,
      parameters: {
        index: 0 // TODO this should be based on the trip item index we are currently displaying
      },

      onSynced() {
        if (!doc.getMap('config').get('initialContentLoaded') && editor) {
          doc.getMap('config').set('initialContentLoaded', true)

          editor.commands.setContent(trip.map && trip.map.notes ? trip.map.notes : "");
        }
      }
    });

    useEffect(() => {
      if (provider) {
        provider.connect();
      }
    }, [provider]);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Collaboration.configure({ document: doc, }),
      CollaborationCursor.configure({
        provider: provider ?? null,
        user: {
          name: user?.name,
          color: '#f783ac'
        }
      })
    ],
  });

  /** Set Page Title To "Map" */
  useEffect(() => {
    document.title = "Map";
  });


  if (trip.owner != "") {

    return (
        <>
          <div className="flex flex-col">
            <iframe className="w-full h-[60vh]"
                    title="Map of trip"
                    referrerPolicy="no-referrer-when-downgrade"
                    src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}
            &q=ICICS+Building,VancouverBC`}>
            </iframe>
            <div className="p-5">
              <Tabs defaultValue="location">
                <Tabs.List>
                  <Tabs.Tab value="location" leftSection={<IconMapPin />}>
                    Location
                  </Tabs.Tab>
                  <Tabs.Tab value="schedule" leftSection={<IconClock />}>
                    Schedule
                  </Tabs.Tab>
                  <Tabs.Tab value="budget" leftSection={<IconReceipt />}>
                    Budget
                  </Tabs.Tab>
                  <Tabs.Tab value="transport" leftSection={<IconBus />}>
                    Transportation
                  </Tabs.Tab>
                  <Tabs.Tab value="notes" leftSection={<IconNotebook />}>
                    Notes
                  </Tabs.Tab>
                </Tabs.List>

                <div>
                  <Tabs.Panel value="location" className="py-2">
                    <h1 className="font-bold text-2xl">{tempLoc && tempLoc.title}</h1>
                    <span>{tempLoc && tempLoc.address}</span>
                  </Tabs.Panel>
                  <Tabs.Panel value="schedule" className="py-2">
                    <h1 className="font-bold text-2xl">Time</h1>
                    <span><b>From:</b> {(new Date(tempLoc && tempLoc.date.start)).toUTCString()}</span>
                    <br />
                    <span><b>To:</b> {(new Date(tempLoc && tempLoc.date.end)).toUTCString()}</span>
                  </Tabs.Panel>
                  <Tabs.Panel value="budget" className="py-2">
                    <h1 className="font-bold text-2xl py-2">Budget</h1>
                    <span><b>Your Expenditures: $5</b></span>
                    <br />
                    <span>Total Expenditures: $25</span>
                  </Tabs.Panel>
                  <Tabs.Panel value="transport" className="py-2">
                    <h1 className="font-bold text-2xl py-2">Transportation</h1>
                    <span><b>Transportation Type: </b>{tempLoc && tempLoc.transportation.type}</span> <br />
                    <span><b>Distance: </b>{tempLoc && tempLoc.transportation.distance}</span><br />
                    <span><b>Estimated Time: </b>{tempLoc && tempLoc.transportation.time}</span><br />
                    <span><b>Total Cost: </b>{tempLoc && tempLoc.transportation.cost}</span>
                  </Tabs.Panel>
                  <Tabs.Panel value="notes" className="py-2">
                    <h1 className="font-bold text-2xl">Notes</h1>
                    {editor ? <RichTextEditor editor={editor} className="border">
                      <RichTextEditor.Toolbar sticky stickyOffset={60}>
                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Bold />
                          <RichTextEditor.Italic />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.H1 />
                          <RichTextEditor.H2 />
                          <RichTextEditor.H3 />
                        </RichTextEditor.ControlsGroup>
                        <RichTextEditor.ControlsGroup>
                          <RichTextEditor.Link />
                          <RichTextEditor.Unlink />
                        </RichTextEditor.ControlsGroup>
                      </RichTextEditor.Toolbar>
                      <RichTextEditor.Content />
                    </RichTextEditor> : <h1>Loading...</h1>}
                  </Tabs.Panel>
                </div>

                <div className="px-10 py-3">
                </div>
              </Tabs>
            </div>
          </div>
        </>
    )
  } else {
    return (
        <div className="flex h-screen items-center justify-center text-center text-7xl font-bold text-red-800">
          Either you are not authenticated, or this trip is private!
        </div>
    )
  }

}

export default TripMapApp;
