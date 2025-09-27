import {createClient} from 'next-sanity'

import {apiVersion, dataset, projectId, sanityReadToken} from '../../env'

export const client = createClient({
  apiVersion,
  projectId,
  dataset,
  useCdn: true, // Set to false if statically generating pages, using ISR or tag-based revalidation
})

export const previewClient = createClient({
  apiVersion,
  projectId,
  dataset,
  useCdn: false,
  token: sanityReadToken,
  perspective: 'previewDrafts',
})

export const getClient = (preview: boolean) => (preview ? previewClient : client)
