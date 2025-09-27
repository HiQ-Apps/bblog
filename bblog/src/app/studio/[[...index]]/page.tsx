/**
 * This route is responsible for the built-in authoring environment using Sanity Studio.
 * All routes under your studio path is handled by this file using Next.js' catch-all routes:
 * https://nextjs.org/docs/routing/dynamic-routes#catch-all-routes
 *
 * You can learn more about the next-sanity package here:
 * https://github.com/sanity-io/next-sanity
 */
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '../../../sanity/the-good-standard/sanity.config'
import { useEffect } from 'react'
import { usePathname, useRouter } from 'next/navigation'

export default function StudioPage() {
  // Redirect any bad paths like /studio/studio to the real tool
  const pathname = usePathname()
  const router = useRouter()

  useEffect(() => {
    const clean = (s: string) => s.replace(/\/+$/, '')
    const p = clean(pathname || '')
    if (p === '/studio' || p === '/studio/studio') {
      router.replace('/studio/structure')
    }
  }, [pathname, router])

  return <NextStudio config={config} />
}