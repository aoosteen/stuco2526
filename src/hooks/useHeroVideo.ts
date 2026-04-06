import {useEffect, useState} from 'react'
import {sanityClient} from '../lib/sanity'

const HERO_VIDEO_QUERY = `
  *[_id == "homeHeroVideo" && _type == "homeHeroVideo" && defined(videoFile.asset)][0]{
    "videoUrl": videoFile.asset->url
  }
`

interface HeroVideoData {
  videoUrl?: string
}

export type HeroVideoStatus = 'loading' | 'ready' | 'missing' | 'error'

interface HeroVideoState {
  videoUrl: string | null
  status: HeroVideoStatus
  error?: string
}

let cachedHeroVideoUrl: string | null = null
let cachedHeroVideoPromise: Promise<string | null> | null = null

async function fetchHeroVideoUrl(): Promise<string | null> {
  if (cachedHeroVideoUrl) return cachedHeroVideoUrl

  if (cachedHeroVideoPromise) return cachedHeroVideoPromise

  cachedHeroVideoPromise = sanityClient
    .withConfig({useCdn: false})
    .fetch<HeroVideoData | null>(HERO_VIDEO_QUERY, {}, {tag: 'home-hero-video'})
    .then((data) => data?.videoUrl ?? null)
    .then((url) => {
      if (url) cachedHeroVideoUrl = url
      return url
    })
    .finally(() => {
      cachedHeroVideoPromise = null
    })

  return cachedHeroVideoPromise
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function fetchWithRetry(signal?: AbortSignal): Promise<string | null> {
  const retryDelaysMs = [350, 900]
  const initial = await fetchHeroVideoUrl()
  if (initial) return initial

  for (const delay of retryDelaysMs) {
    if (signal?.aborted) return null
    await sleep(delay)
    const next = await fetchHeroVideoUrl()
    if (next) return next
  }

  return null
}

export function useHeroVideo() {
  const [state, setState] = useState<HeroVideoState>(() => ({
    videoUrl: cachedHeroVideoUrl,
    status: cachedHeroVideoUrl ? 'ready' : 'loading',
  }))

  useEffect(() => {
    const abortController = new AbortController()
    let isMounted = true

    setState((previous) =>
      previous.videoUrl
        ? previous
        : {videoUrl: null, status: 'loading'},
    )

    fetchWithRetry(abortController.signal)
      .then((url) => {
        if (!isMounted) return
        if (url) {
          setState({videoUrl: url, status: 'ready'})
          return
        }
        setState({videoUrl: null, status: 'missing'})
      })
      .catch((error) => {
        if (!isMounted || error?.name === 'AbortError') return
        console.error('Error fetching homepage hero video:', error)
        setState({
          videoUrl: null,
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        })
      })

    return () => {
      isMounted = false
      abortController.abort()
    }
  }, [])

  useEffect(() => {
    if (!(import.meta as any).env?.DEV) return
    console.debug('[useHeroVideo]', {
      status: state.status,
      hasVideoUrl: Boolean(state.videoUrl),
      error: state.error,
    })
  }, [state.status, state.videoUrl, state.error])

  return state
}
