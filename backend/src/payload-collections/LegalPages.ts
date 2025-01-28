import {HTMLConverterFeature, lexicalEditor, lexicalHTML} from '@payloadcms/richtext-lexical'
import type {CollectionConfig, FieldHook} from 'payload/types'

const format = (val: string): string =>
    val
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '')
        .toLowerCase()

const formatSlug =
    (fallback: string): FieldHook =>
        ({operation, value, originalDoc, data}) => {
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


export const LegalPages: CollectionConfig = {
    slug: 'legal',
    admin: {
        useAsTitle: "title",
    },
    access: {
        read: () => true,
    },
    fields: [
        {
            name: 'title',
            type: 'text',
            required: true,
        },
        {
            name: 'id',
            type: 'text',
            required: true,
        },
        {
            name: 'content',
            type: 'richText',
            editor: lexicalEditor({
                features: ({defaultFeatures}) => [
                    ...defaultFeatures,
                    // The HTMLConverter Feature is the feature which manages the HTML serializers.
                    // If you do not pass any arguments to it, it will use the default serializers.
                    HTMLConverterFeature({}),
                ],
            }),
        },
        lexicalHTML('content', {name: 'content_html'}),
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
