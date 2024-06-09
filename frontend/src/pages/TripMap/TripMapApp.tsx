import { RichTextEditor } from '@mantine/tiptap'
import StarterKit from '@tiptap/starter-kit'
import { useEditor } from '@tiptap/react';

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

const content = '<h3>Trip details</h3><br /><p>This is where I go into detail about all the fun we are going to have, etc.</p>';

const TripMapApp = () => {
  const editor = useEditor({extensions: [StarterKit], content: content}); 

  return (
    <>
      <div className="h-dvh">
        <iframe className="w-full h-3/5"
          title="Map of trip"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/place?key=${apiKey}
            &q=ICICS+Building,VancouverBC`}>
        </iframe>
        <div className="flex">
          <div>
            <div className="px-10 py-3">
              <h1 className="font-bold text-2xl">ICICS Building</h1>
              <span>2366 Main Mall, Vancouver, BC V6T 1Z4</span>
            </div>
            <div className="px-10 py-2">
              <h1 className="font-bold text-2xl">Time</h1>
              <span><b>From:</b> 12:30 pm, Saturday Jan 25th, 2025</span>
              <br />
              <span><b>To:</b> 2:00 pm, Tuesday Feb 4th, 2025</span>
            </div>
            <div className="px-10">
              <h1 className="font-bold text-2xl py-2">Budget</h1>
              <span><b>Your Expenditures: $5</b></span>
              <br />
              <span>Total Expenditures: $25</span>
            </div>
            <div className="px-10">
              <h1 className="font-bold text-2xl py-2">Transportation</h1>
              <span><b>Transportation Type: -----</b></span> <br />
              <span><b>Distance: -----</b></span><br />
              <span><b>Estimated Time: -----</b></span><br />
              <span><b>Total Cost: -----</b></span>
            </div>
          </div>
          <div className="px-10 py-3">
            <h1 className="font-bold text-2xl">Notes</h1>
            <RichTextEditor editor={editor} className="border">
              <RichTextEditor.Toolbar sticky stickyOffset={60}>
              <RichTextEditor.ControlsGroup>
                <RichTextEditor.Bold />
                <RichTextEditor.Italic />
              </RichTextEditor.ControlsGroup>
              </RichTextEditor.Toolbar>
              <RichTextEditor.Content />
            </RichTextEditor>
          </div>

        </div>
      </div>
    </>
  )
}

export default TripMapApp;