import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schema} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'The Good Standard',
  projectId: 'c7t7wvdr',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schema.types,
  },
})
