import { useEffect } from 'react';
import { RichTextEditor } from '@mantine/tiptap'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/react';
import {Tabs} from '@mantine/core';
import {IconBus, IconClock, IconMapPin, IconNotebook, IconReceipt} from '@tabler/icons-react';
import {useSelector} from "react-redux";
import {State} from "../../../Interfaces.ts";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const TripMapApp = () => {
  /** Set Page Title To "Map" */
  useEffect(() => {
    document.title = "Map";
  }, []);

  const trip = useSelector((state: State) => state.trip);
  const tempLoc = trip.tripLocations[0];
  const editor = useEditor({extensions: [StarterKit], content: trip.tripNotes});

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
                <h1 className="font-bold text-2xl">{tempLoc.title}</h1>
                <span>{tempLoc.address}</span>
              </Tabs.Panel>
              <Tabs.Panel value="schedule" className="py-2">
                <h1 className="font-bold text-2xl">Time</h1>
                <span><b>From:</b> {(new Date(tempLoc.date.start)).toUTCString()}</span>
                <br />
                <span><b>To:</b> {(new Date(tempLoc.date.end)).toUTCString()}</span>
              </Tabs.Panel>
              <Tabs.Panel value="budget" className="py-2">
                <h1 className="font-bold text-2xl py-2">Budget</h1>
                <span><b>Your Expenditures: $5</b></span>
                <br />
                <span>Total Expenditures: $25</span>
              </Tabs.Panel>
              <Tabs.Panel value="transport" className="py-2">
                <h1 className="font-bold text-2xl py-2">Transportation</h1>
                <span><b>Transportation Type: </b>{tempLoc.transportation.type}</span> <br />
                <span><b>Distance: </b>{tempLoc.transportation.distance}</span><br />
                <span><b>Estimated Time: </b>{tempLoc.transportation.time}</span><br />
                <span><b>Total Cost: </b>{tempLoc.transportation.cost}</span>
              </Tabs.Panel>
            </div>

            <div className="px-10 py-3">
              <h1 className="font-bold text-2xl">Notes</h1>
              <RichTextEditor editor={editor} className="border">
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
              </RichTextEditor>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default TripMapApp;
