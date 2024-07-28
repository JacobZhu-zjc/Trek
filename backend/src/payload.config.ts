import path from 'path'

import { payloadCloud } from '@payloadcms/plugin-cloud'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { webpackBundler } from '@payloadcms/bundler-webpack'
import { buildConfig } from 'payload/config'
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { cloudStorage } from '@payloadcms/plugin-cloud-storage'
import Admins from './payload-collections/Admins'
import Destinations from './payload-collections/Destinations'
import Media from './payload-collections/Media'
import { Icon } from './graphics/Icon'
import { Logo } from './graphics/Logo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { DestinationDetails } from './payload-collections/DestinationDetails'

export default buildConfig({
  admin: {
    user: Admins.slug,
    bundler: webpackBundler(),
    meta: {
      titleSuffix: '- Trek Admin',
      favicon: '/graphics/trek-admin-panel-favicon.svg',
      ogImage: '/graphics/trek-admin-panel-logo.svg',
    },
    components: {
      graphics: {
        Logo,
        Icon,
      },
    },
    livePreview: {
      collections: ['explore'],
    },
  },
  cors: ['*'],

  editor: lexicalEditor({}),
  collections: [Admins, Destinations, DestinationDetails, Media],
  typescript: {
    outputFile: path.resolve(__dirname, 'payload-types.ts'),
  },
  graphQL: {
    schemaOutputFile: path.resolve(__dirname, 'generated-schema.graphql'),
  },
  plugins: [payloadCloud(),
  cloudStorage({
    collections: {
      // Enable cloud storage for Media collection
      media: {
        // Create the S3 adapter
        adapter: s3Adapter({
          config: {
            region: process.env.ADMIN_S3_REGION,
            credentials: {
              accessKeyId: process.env.ADMIN_S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.ADMIN_S3_SECRET_ACCESS_KEY || '',
            },
          },
          bucket: process.env.ADMIN_S3_BUCKET || '',
        }),
      },
    },
  }),],
  db: mongooseAdapter({
    url: process.env.ATLAS_URI || false,
  }),
})
