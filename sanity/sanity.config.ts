import {defineConfig} from 'sanity'

import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {unsplashImageAsset} from 'sanity-plugin-asset-source-unsplash'
export default defineConfig({
  name: 'default',
  title: 'Student council website',

  projectId: 'kwax2pg0',
  dataset: 'production',

  plugins: [structureTool(), visionTool(),unsplashImageAsset()],

  schema: {
    types: schemaTypes,
  },
})


