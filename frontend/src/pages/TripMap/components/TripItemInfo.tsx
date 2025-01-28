import {Tabs} from "@mantine/core";
import {IconClock, IconMapPin, IconNotebook} from "@tabler/icons-react";
import {RichTextEditor} from "@mantine/tiptap";
import {useContext, useEffect, useMemo, useState} from "react";
import {HocuspocusProvider} from "@hocuspocus/provider";
import {useEditor} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Collaboration from "@tiptap/extension-collaboration";
import {CollaborationCursor} from "@tiptap/extension-collaboration-cursor";
import {TripItemWithDestination} from "src/hooks/TripItem";
import "./TripItemInfo.css";
import {useSelector} from "react-redux";
import {User} from "@trek-types/user";
import {UserContext} from "../../../App.tsx";
import {useParams} from "react-router-dom";


const uri = import.meta.env.PROD ? "wss://" + window.location.hostname : "ws://localhost:3001";

const TripItemInfo = ({selectedWithDest}: { selectedWithDest: TripItemWithDestination }) => {
    const profile = useSelector((state: { user: { self: User } }) => state.user.self);

    const [tab, setTab] = useState<string | null>("location");

    const item = selectedWithDest.tripItem;
    const dest = selectedWithDest.destination;

    const userContext = useContext(UserContext);
    const tripId = useParams().uuid;

    const provider = useMemo(() => {
        console.log("trying token", userContext.token);
        return new HocuspocusProvider({
            name: item?.key ?? "",
            url: `${uri}/collaboration`,
            token: userContext.token,
            parameters: {
                id: tripId
            }
        })
    }, [item, userContext.token]);

    const editor = useEditor({
        extensions: [
            StarterKit,
            Collaboration.configure({document: provider.document,}),
            CollaborationCursor.configure({
                provider: provider,
                user: {
                    name: profile?.name,
                    color: '#f783ac'
                }
            })
        ],
    }, [item]);

    useEffect(() => {
        setTab("location");
    }, [item]);


    return (<>
        <div className="p-5">
            <Tabs value={tab} onChange={setTab}>
                <Tabs.List>
                    <Tabs.Tab value="location" leftSection={<IconMapPin/>}>
                        Location
                    </Tabs.Tab>
                    <Tabs.Tab value="schedule" leftSection={<IconClock/>}>
                        Schedule
                    </Tabs.Tab>
                    <Tabs.Tab value="notes" leftSection={<IconNotebook/>}>
                        Notes
                    </Tabs.Tab>
                </Tabs.List>

                <div>
                    <Tabs.Panel value="location" className="py-2">
                        <h1 className="font-bold text-2xl">{dest && dest.properties.name}</h1>
                        <p>{dest && dest.properties.address}</p>
                    </Tabs.Panel>
                    <Tabs.Panel value="schedule" className="py-2">
                        {item.date && item.date.start && item.date.end &&
                            <>
                                <h1 className="font-bold text-2xl">Time</h1>
                                <span><b>From:</b> {(item.date.start).toUTCString()}</span>
                                <br/>
                                <span><b>To:</b> {(item.date.end).toUTCString()}</span>
                            </>
                        }
                    </Tabs.Panel>
                    <Tabs.Panel value="notes" className="py-2">
                        <h1 className="font-bold text-2xl">Notes</h1>
                        {editor ? <RichTextEditor editor={editor} className="border">
                            <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Bold/>
                                    <RichTextEditor.Italic/>
                                </RichTextEditor.ControlsGroup>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.H1/>
                                    <RichTextEditor.H2/>
                                    <RichTextEditor.H3/>
                                </RichTextEditor.ControlsGroup>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Link/>
                                    <RichTextEditor.Unlink/>
                                </RichTextEditor.ControlsGroup>
                            </RichTextEditor.Toolbar>
                            <RichTextEditor.Content/>
                        </RichTextEditor> : <h1>Loading...</h1>}
                    </Tabs.Panel>
                </div>
                <div className="px-10 py-3">
                </div>
            </Tabs>
        </div>

    </>);
}

export default TripItemInfo;
