// sanity.config.ts
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schema} from './schemaTypes'
import resolveProductionUrl from './lib/resolveProductionUrl'
import {projectId, dataset, apiVersion} from '../env'
import { SanityDocument } from 'next-sanity'

export default defineConfig({
  name: 'default',
  title: 'The Good Standard',
  version: apiVersion,
  projectId,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: {types: schema.types},

  document: {
    productionUrl: async (prev, {document}) => {
      const url = resolveProductionUrl(document as SanityDocument)
      return url ?? prev
    },
  },
})
