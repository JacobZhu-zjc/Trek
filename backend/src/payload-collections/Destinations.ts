import payload from "payload";
import { CollectionConfig } from "payload/types";
import { upsertDestination } from "../utils/destinations";

const Destinations: CollectionConfig = {
    slug: 'destinations',
    labels: {
        singular: 'Destination',
        plural: 'Destinations',
    },
    admin: {
        useAsTitle: 'properties.name',
    },
    auth: false,
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'type',
            type: 'select',
            options: [
                { label: 'Feature', value: 'Feature' },
            ],
            required: true,
        },
        {
            name: 'geometry',
            type: 'point',
            required: false,
        },
        {
            name: 'properties',
            type: 'group',
            fields: [
                {
                    name: 'mapbox_id',
                    type: 'text',
                },
                {
                    name: 'osm_id',
                    type: 'text',
                },
                {
                    name: 'osm_type',
                    type: 'text',
                },
                {
                    name: 'wikidata_id',
                    type: 'text',
                },
                {
                    name: 'geonames_id',
                    type: 'number',
                },
                {
                    name: 'wikipedia',
                    type: 'text',
                },
                {
                    name: 'wikipedia_url',
                    type: 'text',
                },
                {
                    name: 'destination_type',
                    type: 'select',
                    options: [
                        { label: 'POI', value: 'poi' },
                        { label: 'Address', value: 'address' },
                        { label: 'Area', value: 'area' },
                    ],
                    required: true,
                },
                {
                    name: 'name',
                    type: 'text',
                    required: true,
                },
                {
                    name: 'display_name',
                    type: 'text',
                },
                {
                    name: 'description',
                    type: 'textarea',
                },
                {
                    name: 'address',
                    type: 'text',
                    admin: {
                        condition: (data, siblingData) => siblingData.destination_type !== 'area',
                    },
                },
                {
                    name: 'main_photo',
                    type: 'relationship',
                    relationTo: 'media',
                },
                {
                    name: 'poi_category',
                    type: 'text',
                    admin: {
                        condition: (data, siblingData) => siblingData.destination_type === 'poi',
                    },
                },
                {
                    name: 'timezone',
                    type: 'text',
                },
                {
                    name: 'bbox',
                    type: 'group',
                    fields: [
                        {
                            name: 'min_latitude',
                            type: 'number',
                        },
                        {
                            name: 'min_longitude',
                            type: 'number',
                        },
                        {
                            name: 'max_latitude',
                            type: 'number',
                        },
                        {
                            name: 'max_longitude',
                            type: 'number',
                        },
                    ],
                }
            ],
        },
    ],
    endpoints: [
        {
            path: "/upsert/osm",
            method: "post",
            handler: async (req, res, next) => {
                // get the osm_id and osm_type from the request body
                const { osm_id, osm_type } = req.body;
                if (!osm_id || !osm_type) {
                    return res.status(400).send("osm_id and osm_type required");
                }
                try {
                    const destinationId = await upsertDestination(osm_id, osm_type);
                    console.log("destinationId: ", destinationId);
                    const destination = await payload.findByID({
                        collection: 'destinations',
                        id: destinationId,
                        depth: 4,
                    });
                    console.log("destination: ", destination);
                    res.status(200).send(destination);
                } catch {
                    res.status(500).send("Error upserting destination");
                }
            }
        }
    ]
}

export default Destinations
