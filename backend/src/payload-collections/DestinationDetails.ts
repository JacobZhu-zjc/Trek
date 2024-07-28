import type { CollectionConfig, FieldHook } from 'payload/types'

const format = (val: string): string =>
    val
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .toLowerCase()

const formatSlug =
    (fallback: string): FieldHook =>
        ({ operation, value, originalDoc, data }) => {
            if (typeof value === 'string') {
                return format(value)
            }

            if (operation === 'create') {
                const fallbackData = data?.[fallback] || originalDoc?.[fallback]

                if (fallbackData && typeof fallbackData === 'string') {
                    return format(fallbackData)
                }
            }

            return value
        }



export const DestinationDetails: CollectionConfig = {
    slug: 'explore',
    admin: {
        useAsTitle: "destination",
        livePreview: {
            url: ({
                data,
                documentInfo,
                locale
            }) => `http://localhost:5173/explore/${data.slug}/preview`,
        }
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'destination',
            type: 'relationship',
            relationTo: 'destinations',
            required: true,
        },
        {
            name: 'description',
            type: 'textarea',
            maxLength: 600,
            required: true,
        },
        {
            name: "know_before",
            type: "group",
            fields: [
                {
                    name: "cost",
                    type: "textarea",
                    maxLength: 350
                },
                {
                    name: "transportation",
                    type: "textarea",
                    maxLength: 350
                },
                {
                    name: "safety",
                    type: "textarea",
                    maxLength: 350
                },
            ],
        },
        {
            name: 'slug',
            label: 'Slug',
            type: 'text',
            index: true,
            admin: {
                position: 'sidebar',
            },
            hooks: {
                beforeValidate: [formatSlug('title')],
            },
        },
    ]
}