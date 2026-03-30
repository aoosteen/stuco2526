import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Student council website',
  projectId: 'kwax2pg0', // Replace with your projectId
  dataset: 'production',        // Replace with your dataset

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
})
