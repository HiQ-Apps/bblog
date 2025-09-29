// Querying with "sanityFetch" will keep content automatically updated
// Before using it, import and render "<SanityLive />" in your layout, see
// https://github.com/sanity-io/next-sanity#live-content-api for more information.
// src/sanity/lib/live.ts
import {createClient} from 'next-sanity'
import {defineLive} from 'next-sanity/live'
import {dataset, projectId, apiVersion, sanityReadToken} from '../../env'

const useCdn = !sanityReadToken

export const client = createClient({
  projectId: projectId,
  dataset: dataset,
  apiVersion: apiVersion,
  useCdn,
  // Optional but nice for Visual Editing URL hints:
  stega: {studioUrl: '/studio'},
})

export const {SanityLive, sanityFetch} = defineLive({
  client,
  browserToken: false,
  serverToken: sanityReadToken,
})
