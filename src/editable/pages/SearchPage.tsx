import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Filter, Search } from 'lucide-react'
import { buildPageMetadata } from '@/lib/seo'
import { fetchSiteFeed } from '@/lib/site-connector'
import { buildPostUrl, getPostTaskKey } from '@/lib/task-data'
import { getMockPostsForTask } from '@/lib/mock-posts'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { pagesContent } from '@/editable/content/pages.content'

export const revalidate = 3

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({
    path: '/search',
    title: pagesContent.search.metadata.title,
    description: pagesContent.search.metadata.description,
  })
}

const stripHtml = (value: string) => value.replace(/<[^>]*>/g, ' ')
const compactText = (value: unknown) => (typeof value === 'string' ? stripHtml(value).replace(/\s+/g, ' ').trim().toLowerCase() : '')
const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const compactRaw = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const getImage = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.find((item) => typeof item?.url === 'string')?.url : ''
  const images = Array.isArray(content.images) ? (content.images.find((item) => typeof item === 'string') as string | undefined) : ''
  return media || compactRaw(content.featuredImage) || compactRaw(content.image) || compactRaw(content.thumbnail) || images || ''
}
const summaryOf = (post: SitePost) => post.summary || compactRaw(getContent(post).description) || compactRaw(getContent(post).excerpt) || ''

const matches = (post: SitePost, query: string, category: string, task: string) => {
  const content = getContent(post)
  const typeText = compactText(content.type)
  if (typeText === 'comment') return false
  const derivedTask = getPostTaskKey(post) || typeText
  if (task && derivedTask !== task) return false
  const categoryText = compactText(content.category)
  const tagsText = compactText(Array.isArray(post.tags) ? post.tags.join(' ') : '')
  if (category && !(categoryText || tagsText).includes(category)) return false
  if (!query) return true
  return [post.title, post.summary, content.description, content.body, content.excerpt, content.category, Array.isArray(post.tags) ? post.tags.join(' ') : '']
    .some((value) => compactText(value).includes(query))
}

function SearchResultCard({ post, index }: { post: SitePost; index: number }) {
  const task = getPostTaskKey(post) as TaskKey | null
  const href = task ? buildPostUrl(task, post.slug) : `/article/${post.slug}`
  const image = getImage(post)
  const summary = summaryOf(post)
  const taskLabel = SITE_CONFIG.tasks.find((item) => item.key === task)?.label || 'Post'
  const strong = index % 5 === 0

  return (
    <Link href={href} className={`group block overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_60px_rgba(20,13,16,0.08)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(20,13,16,0.12)] ${strong ? 'md:col-span-2' : ''}`}>
      {image ? (
        <div className={`relative overflow-hidden bg-black ${strong ? 'aspect-[16/7]' : 'aspect-[16/10]'}`}>
          <img src={image} alt="" className="h-full w-full object-cover opacity-90 transition duration-500 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-black">{taskLabel}</span>
        </div>
      ) : null}
      <div className="p-6 sm:p-7">
        {!image ? <span className="rounded-full bg-[#140d10] px-3 py-1 text-[11px] font-black uppercase tracking-[0.18em] text-white">{taskLabel}</span> : null}
        <h2 className="mt-4 text-3xl font-black leading-[0.95] tracking-[-0.06em] text-[#2a0d12]">{post.title}</h2>
        {summary ? <p className="mt-4 line-clamp-3 text-base leading-8 text-[#6f403e]">{summary}</p> : null}
        <span className="mt-5 inline-flex items-center gap-2 text-sm font-black uppercase tracking-[0.18em] text-[#4b1826]">Open result <ArrowRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

export default async function SearchPage({ searchParams }: { searchParams?: Promise<{ q?: string; category?: string; task?: string; master?: string }> }) {
  const resolved = (await searchParams) || {}
  const query = (resolved.q || '').trim()
  const normalized = query.toLowerCase()
  const category = (resolved.category || '').trim().toLowerCase()
  const task = (resolved.task || '').trim().toLowerCase()
  const useMaster = resolved.master !== '0'
  const feed = await fetchSiteFeed(useMaster ? 1000 : 300, useMaster ? { fresh: true, category: category || undefined, task: task || undefined } : undefined)
  const posts = feed?.posts?.length ? feed.posts : useMaster ? [] : SITE_CONFIG.tasks.filter((item) => item.enabled).flatMap((item) => getMockPostsForTask(item.key))
  const results = posts.filter((post) => matches(post, normalized, category, task)).slice(0, normalized ? 80 : 36)
  const enabledTasks = SITE_CONFIG.tasks.filter((item) => item.enabled)

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[#f4f4ec] text-[#241314]">
        <section className="bg-[linear-gradient(135deg,#140d10_0%,#4b1826_100%)] text-white">
          <div className="mx-auto grid max-w-[1480px] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-10 lg:py-20">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-[#D1D8BE]">{pagesContent.search.hero.badge}</p>
              <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.92] tracking-[-0.08em] sm:text-7xl">{pagesContent.search.hero.title}</h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">{pagesContent.search.hero.description}</p>
            </div>
            <form action="/search" className="self-end rounded-[2rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
              <input type="hidden" name="master" value="1" />
              <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/90 px-4 py-4 text-[#241314]">
                <Search className="h-5 w-5 opacity-55" />
                <input name="q" defaultValue={query} placeholder={pagesContent.search.hero.placeholder} className="min-w-0 flex-1 bg-transparent text-base font-bold outline-none placeholder:text-current/35" />
              </label>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <label className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/90 px-4 py-4 text-[#241314]">
                  <Filter className="h-4 w-4 opacity-55" />
                  <input name="category" defaultValue={category} placeholder="Category" className="min-w-0 flex-1 bg-transparent text-sm font-bold outline-none placeholder:text-current/35" />
                </label>
                <select name="task" defaultValue={task} className="rounded-2xl border border-white/10 bg-white/90 px-4 py-4 text-sm font-black text-[#241314] outline-none">
                  <option value="">All content types</option>
                  {enabledTasks.map((item) => <option key={item.key} value={item.key}>{item.label}</option>)}
                </select>
              </div>
              <button className="mt-3 inline-flex h-12 w-full items-center justify-center rounded-2xl bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-[#140d10] transition hover:-translate-y-0.5" type="submit">Search</button>
            </form>
          </div>
        </section>

        <section className="mx-auto max-w-[1480px] px-4 py-12 sm:px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.24em] text-[#819A91]">{results.length} results</p>
              <h2 className="mt-2 text-4xl font-black tracking-[-0.06em] text-[#2a0d12]">{query ? `Results for "${query}"` : pagesContent.search.resultsTitle}</h2>
            </div>
            <Link href="/article" className="inline-flex items-center gap-2 rounded-full bg-[#140d10] px-6 py-3 text-sm font-black text-white">Browse latest <ArrowRight className="h-4 w-4" /></Link>
          </div>

          {results.length ? (
            <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {results.map((post, index) => <SearchResultCard key={post.id || post.slug} post={post} index={index} />)}
            </div>
          ) : (
            <div className="mt-8 rounded-[2rem] border border-dashed border-[#2a18141a] bg-white p-10 text-center">
              <p className="text-3xl font-black tracking-[-0.04em] text-[#2a0d12]">No matching posts found.</p>
              <p className="mt-3 text-base text-[#6f403e]">Try a different keyword, task type, or category.</p>
            </div>
          )}
        </section>
      </main>
    </EditableSiteShell>
  )
}
