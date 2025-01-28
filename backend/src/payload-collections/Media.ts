import {CollectionConfig} from "payload/types";

const Media: CollectionConfig = {
    slug: 'media',
    upload: {
        staticURL: '/media',
        staticDir: 'media',
        imageSizes: [
            {
                name: 'thumbnail',
                width: 400,
                height: 300,
                position: 'centre',
            },
            {
                name: 'card',
                width: 768,
                height: 1024,
                position: 'centre',
            },
            {
                name: 'tablet',
                width: 1024,
                // By specifying `undefined` or leaving a height undefined,
                // the image will be sized to a certain width,
                // but it will retain its original aspect ratio
                // and calculate a height automatically.
                height: undefined,
                position: 'centre',
            },
        ],
        adminThumbnail: 'thumbnail',
        mimeTypes: ['image/*'],
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            type: 'select',
            name: 'image_origin',
            options: [
                {label: 'Trek', value: 'trek'},
                {label: 'External', value: 'external'},
            ],
            required: true
        },
        {
            type: 'text',
            name: 'artist',
            required: false
        },
        {
            type: 'text',
            name: 'license_url',
            required: false
        },
        {
            type: 'text',
            name: 'license',
            required: false
        },
    ],
}

export default Media;
