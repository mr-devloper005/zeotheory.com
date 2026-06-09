import Link from 'next/link'
import type { CSSProperties } from 'react'
import { ArrowRight, Bookmark, BriefcaseBusiness, Building2, Camera, Download, FileText, Filter, Globe2, Image as ImageIcon, MapPin, Megaphone, Search, UserRound } from 'lucide-react'
import { buildTaskMetadata } from '@/lib/seo'
import { CATEGORY_OPTIONS, normalizeCategory } from '@/lib/categories'
import { fetchPaginatedTaskPosts, buildPostUrl } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SiteFeedPagination, SitePost } from '@/lib/site-connector'
import { taskPageMetadata } from '@/config/site.content'
import { taskPageVoices } from '@/editable/content/task-pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export const taskMetadata = (task: TaskKey, path: string) =>
  buildTaskMetadata(task, {
    path,
    title: taskPageMetadata[task]?.title,
    description: taskPageMetadata[task]?.description,
  })

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const image = asText(content.image) || asText(content.featuredImage) || asText(content.thumbnail)
  const logo = asText(content.logo)
  return [...media, ...images, ...(isUrl(image) ? [image] : []), ...(isUrl(logo) ? [logo] : [])].filter(Boolean).slice(0, 8)
}

const placeholder = '/placeholder.svg?height=900&width=1200'
const getImage = (post: SitePost) => getImages(post)[0] || placeholder
const getCategory = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const getSummary = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || asText(getContent(post).body)
const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

function pageHref(basePath: string, category: string, page: number) {
  const params = new URLSearchParams()
  if (category && category !== 'all') params.set('category', category)
  if (page > 1) params.set('page', String(page))
  const query = params.toString()
  return query ? `${basePath}?${query}` : basePath
}

const taskDeck: Record<TaskKey, { icon: typeof FileText; archiveClass: string; promise: string; badge: string }> = {
  article: { icon: FileText, archiveClass: 'grid gap-6 xl:grid-cols-2', promise: 'Editorial stories get wide reading cards with calmer summaries and stronger cover imagery.', badge: 'Journal' },
  listing: { icon: Building2, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Business entries keep trust cues, location, and quick actions easy to scan.', badge: 'Directory' },
  classified: { icon: Megaphone, archiveClass: 'grid gap-5 xl:grid-cols-2', promise: 'Offers stay sharp, actionable, and easy to compare at a glance.', badge: 'Offer' },
  image: { icon: Camera, archiveClass: 'columns-1 gap-5 space-y-5 md:columns-2 xl:columns-3', promise: 'Image posts lead with larger visuals and a more gallery-like rhythm.', badge: 'Gallery' },
  sbm: { icon: Bookmark, archiveClass: 'grid gap-4 md:grid-cols-2 xl:grid-cols-3', promise: 'Saved resources stay clean and shelf-like for quicker browsing.', badge: 'Shelf' },
  pdf: { icon: Download, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-3', promise: 'Documents feel organized, clear, and more archive-ready.', badge: 'Library' },
  profile: { icon: UserRound, archiveClass: 'grid gap-5 md:grid-cols-2 xl:grid-cols-4', promise: 'Profiles focus on identity, portrait, role, and a compact introduction.', badge: 'Profile' },
}

export async function EditableTaskArchiveRoute({
  task,
  searchParams,
  basePath,
}: {
  task: TaskKey
  searchParams?: Promise<{ category?: string; page?: string }>
  basePath?: string
}) {
  const resolved = (await searchParams) || {}
  const page = Math.max(1, Math.floor(Number(resolved.page) || 1))
  const category = resolved.category ? normalizeCategory(resolved.category) : 'all'
  const taskConfig = getTaskConfig(task)
  const { posts, pagination } = await fetchPaginatedTaskPosts(task, { page, limit: 24, category })
  return <TaskArchiveView task={task} posts={posts} pagination={pagination} category={category} basePath={basePath || taskConfig?.route || `/${task}`} />
}

export function TaskArchiveView({ task, posts, pagination, category, basePath }: { task: TaskKey; posts: SitePost[]; pagination: SiteFeedPagination; category: string; basePath: string }) {
  const taskConfig = getTaskConfig(task)
  const voice = taskPageVoices[task]
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const page = pagination.page || 1
  const label = taskConfig?.label || task
  const deck = taskDeck[task]
  const Icon = deck.icon
  const archiveVars = { '--archive-bg': preset.colors.background, '--archive-text': preset.colors.foreground, '--archive-surface': preset.colors.surface, '--archive-accent': preset.colors.accent } as CSSProperties
  const categoryLabel = category === 'all' ? 'All categories' : CATEGORY_OPTIONS.find((item) => item.slug === category)?.name || category
  const quickCategories = CATEGORY_OPTIONS.slice(0, 6)

  if (task === 'profile') {
    return (
      <EditableSiteShell>
        <main style={archiveVars} className="bg-[#f3f0e6] text-black">
          <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
            <div className="grid gap-6 lg:grid-cols-[1.12fr_0.88fr]">
              <div className="rounded-[2.8rem] bg-[linear-gradient(135deg,#0f1516_0%,#243730_45%,#819A91_100%)] p-8 text-white shadow-[0_32px_90px_rgba(15,20,23,0.18)] sm:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#D1D8BE]">{voice.eyebrow}</span>
                  <span className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/70">Professional dashboard</span>
                </div>
                <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[0.96] tracking-[-0.07em] sm:text-6xl">{voice.headline}</h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-white/76">{voice.description}</p>
                <div className="mt-8 flex flex-wrap gap-3">
                  {voice.chips.map((chip) => (
                    <span key={chip} className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold text-white/82">{chip}</span>
                  ))}
                </div>
                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  {[
                    ['Profiles live', String(posts.length || 0)],
                    ['Filtered view', categoryLabel],
                    ['Directory type', 'Identity-first'],
                  ].map(([labelText, value]) => (
                    <div key={labelText} className="rounded-[1.9rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                      <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#D1D8BE]">{labelText}</p>
                      <p className="mt-3 text-2xl font-black tracking-[-0.04em] text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-5">
                <form action={basePath} className="rounded-[2.2rem] border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.07)]">
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#819A91]"><Filter className="h-4 w-4" /> {voice.filterLabel}</div>
                  <select
                    name="category"
                    defaultValue={category}
                    className="mt-4 h-14 w-full rounded-[1.35rem] border border-black/10 bg-[#f7f5ed] px-4 text-sm font-bold text-black outline-none"
                  >
                    <option value="all">All categories</option>
                    {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
                  </select>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <button className="h-14 rounded-[1.35rem] bg-[#111111] text-sm font-black uppercase tracking-[0.16em] text-white">Apply filter</button>
                    <Link href={basePath} className="inline-flex h-14 items-center justify-center rounded-[1.35rem] border border-black/10 bg-[#f7f5ed] text-sm font-black uppercase tracking-[0.16em] text-black">Reset view</Link>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {quickCategories.map((item) => (
                      <Link
                        key={item.slug}
                        href={`${basePath}?category=${encodeURIComponent(item.slug)}`}
                        className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[0.14em] ${category === item.slug ? 'bg-[#111111] text-white' : 'border border-black/10 bg-white text-black'}`}
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </form>

                <div className="rounded-[2.2rem] border border-black/8 bg-[#e7ecdd] p-6 text-black shadow-[0_18px_50px_rgba(15,23,42,0.05)]">
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[#355148]">Profile experience</p>
                  <h2 className="mt-3 text-3xl font-black tracking-[-0.05em]">A clearer member directory</h2>
                  <p className="mt-4 text-sm leading-7 text-black/70">{voice.secondaryNote}</p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Link href="/search" className="rounded-full bg-[#111111] px-5 py-3 text-sm font-black text-white">Search profiles</Link>
                    <Link href="/about" className="rounded-full border border-black/10 px-5 py-3 text-sm font-black text-black">About platform</Link>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1440px] px-4 pb-16 sm:px-6 lg:px-10">
            {posts.length ? (
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />)}
              </div>
            ) : (
              <div className="rounded-[2rem] border border-dashed border-black/10 bg-white p-10 text-center shadow-[0_12px_40px_rgba(7,21,29,0.05)]">
                <Search className="mx-auto h-8 w-8 text-black/40" />
                <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">No profiles found</h2>
                <p className="mt-2 text-sm text-black/56">Try another category or publish new profiles to populate this directory.</p>
              </div>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
              {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
              <span className="rounded-full bg-[#111111] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
              {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-black/10 bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main style={archiveVars} className="bg-[var(--archive-bg)] text-[var(--archive-text)]">
        <section className="mx-auto grid max-w-[1320px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1.03fr_0.97fr] lg:px-8 lg:py-20">
          <div className="overflow-hidden rounded-[2.6rem] bg-[linear-gradient(135deg,#07151d_0%,#0b2c37_60%,#114857_100%)] p-8 text-white shadow-[0_32px_100px_rgba(5,16,22,0.22)] sm:p-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/8 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#7ab2b2]"><Icon className="h-4 w-4" /> {voice.eyebrow}</div>
            <h1 className="mt-6 max-w-4xl font-serif text-5xl font-semibold leading-[0.94] tracking-[-0.06em] sm:text-6xl">{voice.headline}</h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/74">{voice.description}</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {voice.chips.map((chip) => <span key={chip} className="rounded-full border border-white/12 bg-white/8 px-4 py-2 text-sm font-bold text-white/80">{chip}</span>)}
            </div>
            <div className="mt-8 rounded-[1.6rem] border border-white/12 bg-white/8 p-5 text-sm leading-7 text-white/70">{deck.promise}</div>
          </div>

          <div className="grid gap-5 self-end">
            <form action={basePath} className="rounded-[2rem] border border-[#2a18141a] bg-white p-5 text-[#111111] shadow-[0_18px_60px_rgba(7,21,29,0.08)]">
              <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.28em] text-[var(--archive-accent)]"><Filter className="h-4 w-4" /> {voice.filterLabel}</div>
              <select
                name="category"
                defaultValue={category}
                className="mt-4 h-12 w-full rounded-2xl border border-[#2a18141a] bg-[var(--slot4-gray)] px-4 text-sm font-bold text-black outline-none"
                style={{ color: '#111111', backgroundColor: 'var(--slot4-gray)' }}
              >
                <option value="all">All categories</option>
                {CATEGORY_OPTIONS.map((item) => <option key={item.slug} value={item.slug}>{item.name}</option>)}
              </select>
              <button className="mt-3 h-12 w-full rounded-2xl bg-[var(--slot4-accent-fill)] text-sm font-black text-white">Apply filter</button>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link href={basePath} className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${category === 'all' ? 'bg-[#111111] text-white' : 'border border-[#2a18141a] bg-white text-black'}`}>All</Link>
                {quickCategories.map((item) => (
                  <Link
                    key={item.slug}
                    href={`${basePath}?category=${encodeURIComponent(item.slug)}`}
                    className={`rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.14em] ${category === item.slug ? 'bg-[#111111] text-white' : 'border border-[#2a18141a] bg-[var(--slot4-gray)] text-black hover:bg-white'}`}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
              <p className="mt-3 text-xs font-bold text-[#3d3d3d]">Showing: {categoryLabel}</p>
            </form>

            <div className="rounded-[2rem] border border-[#2a18141a] bg-white p-5 text-black shadow-[0_16px_50px_rgba(7,21,29,0.06)]">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.28em] text-[var(--archive-accent)]">{deck.badge}</p>
                  <h2 className="mt-2 font-serif text-3xl font-semibold tracking-[-0.05em]">Browse {label.toLowerCase()}</h2>
                </div>
                <Search className="h-5 w-5 text-[var(--slot4-soft-muted-text)]" />
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={basePath} className="rounded-full bg-[#07151d] px-5 py-3 text-sm font-black text-white">Browse all</Link>
                <Link href="/search" className="rounded-full border border-[#0a31401a] px-5 py-3 text-sm font-black text-[var(--archive-text)]">Search posts</Link>
                <Link href="/image" className="rounded-full border border-[#2a18141a] bg-[var(--slot4-gray)] px-5 py-3 text-sm font-black text-black">Visual picks</Link>
                <Link href="/article" className="rounded-full border border-[#2a18141a] bg-[var(--slot4-gray)] px-5 py-3 text-sm font-black text-black">Latest stories</Link>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-[1320px] px-4 pb-16 sm:px-6 lg:px-8">
          {posts.length ? (
            <div className={deck.archiveClass}>
              {posts.map((post, index) => <ArchivePostCard key={post.id || post.slug || index} post={post} task={task} basePath={basePath} index={index} />)}
            </div>
          ) : (
            <div className="rounded-[2rem] border border-dashed border-[#0a31401a] bg-white/80 p-10 text-center shadow-[0_12px_40px_rgba(7,21,29,0.05)]">
              <Search className="mx-auto h-8 w-8 text-[var(--slot4-soft-muted-text)]" />
              <h2 className="mt-4 font-serif text-3xl font-semibold tracking-[-0.05em]">No posts found</h2>
              <p className="mt-2 text-sm text-[var(--slot4-soft-muted-text)]">Try another category or refresh this page after publishing new content.</p>
            </div>
          )}

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {pagination.hasPrevPage ? <Link href={pageHref(basePath, category, page - 1)} className="rounded-full border border-[#0a31401a] bg-white px-5 py-3 text-sm font-black">Previous</Link> : null}
            <span className="rounded-full bg-[#07151d] px-5 py-3 text-sm font-black text-white">Page {page} of {pagination.totalPages || 1}</span>
            {pagination.hasNextPage ? <Link href={pageHref(basePath, category, page + 1)} className="rounded-full border border-[#0a31401a] bg-white px-5 py-3 text-sm font-black">Next</Link> : null}
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}

function ArchivePostCard({ post, task, basePath, index }: { post: SitePost; task: TaskKey; basePath: string; index: number }) {
  const href = post.slug ? `${basePath}/${post.slug}` : buildPostUrl(task, post.slug)
  if (task === 'listing') return <ListingArchiveCard post={post} href={href} />
  if (task === 'classified') return <ClassifiedArchiveCard post={post} href={href} />
  if (task === 'image') return <ImageArchiveCard post={post} href={href} index={index} />
  if (task === 'sbm') return <BookmarkArchiveCard post={post} href={href} index={index} />
  if (task === 'pdf') return <PdfArchiveCard post={post} href={href} />
  if (task === 'profile') return <ProfileArchiveCard post={post} href={href} />
  return <ArticleArchiveCard post={post} href={href} index={index} />
}

function ArticleArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  const category = getCategory(post, 'Article')
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#0a31401a] bg-white shadow-[0_18px_60px_rgba(7,21,29,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_80px_rgba(7,21,29,0.12)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgba(7,21,29,0.72)_100%)]" />
        <span className="absolute left-4 top-4 rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-[#08202a]">{category}</span>
      </div>
      <div className="p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.24em] text-black">Story {String(index + 1).padStart(2, '0')}</p>
        <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight tracking-[-0.05em] text-black">{post.title}</h2>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-black">{getSummary(post)}</p>
      </div>
    </Link>
  )
}

function ListingArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const logo = getImages(post)[0]
  const location = getField(post, ['location', 'address', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const website = getField(post, ['website', 'url'])
  return (
    <Link href={href} className="group grid gap-5 rounded-[2rem] border border-[#0a31401a] bg-white p-5 shadow-[0_16px_48px_rgba(7,21,29,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,21,29,0.1)] sm:grid-cols-[120px_1fr]">
      <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.5rem] bg-[var(--slot4-gray)] ring-1 ring-[#0a31401a]">
        {logo ? <img src={logo} alt="" className="h-full w-full object-cover" /> : <BriefcaseBusiness className="h-10 w-10 opacity-45" />}
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full bg-[#07151d] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-white">Directory</span>
          {location ? <span className="inline-flex items-center gap-1 rounded-full border border-[#0a31401a] px-3 py-1 text-[10px] font-black uppercase tracking-[0.14em]"><MapPin className="h-3 w-3" /> {location}</span> : null}
        </div>
        <h2 className="mt-4 font-serif text-3xl font-semibold leading-tight tracking-[-0.05em] text-black">{post.title}</h2>
        <p className="mt-3 line-clamp-2 text-sm leading-7 text-black">{getSummary(post)}</p>
        <div className="mt-4 grid gap-2 text-xs font-bold text-black sm:grid-cols-2">
          {phone ? <span>Phone: {phone}</span> : null}
          {website ? <span>Website available</span> : null}
        </div>
      </div>
    </Link>
  )
}

function ClassifiedArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const image = getImages(post)[0]
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'type', 'availability'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2rem] border border-[#0a31401a] bg-white shadow-[0_16px_48px_rgba(7,21,29,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,21,29,0.1)]">
      <div className="grid min-h-64 sm:grid-cols-[0.72fr_1fr]">
        <div className="relative bg-[#07151d] p-5 text-white">
          <span className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Classified</span>
          <h2 className="mt-10 font-serif text-4xl font-semibold leading-[1] tracking-[-0.06em]">{price || 'Open offer'}</h2>
          <p className="mt-4 text-sm font-bold text-white/75">{location || condition || 'Details inside'}</p>
          {image ? <img src={image} alt="" className="absolute bottom-4 right-4 h-20 w-20 rounded-2xl object-cover opacity-80" /> : null}
        </div>
        <div className="p-6">
          <h2 className="font-serif text-3xl font-semibold leading-tight tracking-[-0.05em] text-black">{post.title}</h2>
          <p className="mt-4 line-clamp-4 text-sm leading-7 text-black">{getSummary(post)}</p>
          <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-[var(--archive-accent)]">View listing <ArrowRight className="h-4 w-4" /></p>
        </div>
      </div>
    </Link>
  )
}

function ImageArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const image = getImage(post)
  return (
    <Link href={href} className="group mb-5 block break-inside-avoid overflow-hidden rounded-[2rem] border border-[#0a31401a] bg-white shadow-[0_14px_42px_rgba(7,21,29,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,21,29,0.1)]">
      <div className={index % 3 === 0 ? 'aspect-[3/4]' : 'aspect-[4/3]'}>
        <img src={image} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
      </div>
      <div className="p-5">
        <div className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-gray)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.16em] text-black"><ImageIcon className="h-3 w-3" /> Visual</div>
        <h2 className="mt-4 line-clamp-3 font-serif text-2xl font-semibold leading-tight tracking-[-0.04em] text-black">{post.title}</h2>
      </div>
    </Link>
  )
}

function BookmarkArchiveCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <Link href={href} className="group block rounded-[1.8rem] border border-[#0a31401a] bg-white p-6 shadow-[0_14px_42px_rgba(7,21,29,0.06)] transition hover:-translate-y-1 hover:bg-[#07151d] hover:text-white">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border border-current/20 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em]">Save {String(index + 1).padStart(2, '0')}</span>
        <Bookmark className="h-5 w-5" />
      </div>
      <h2 className="mt-8 font-serif text-2xl font-semibold leading-tight tracking-[-0.05em] text-black group-hover:text-white">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-black/80 group-hover:text-white/72">{getSummary(post)}</p>
      {website ? <p className="mt-5 truncate text-xs font-black uppercase tracking-[0.16em] opacity-60">{website.replace(/^https?:\/\//, '')}</p> : null}
    </Link>
  )
}

function PdfArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const category = getCategory(post, 'PDF')
  return (
    <Link href={href} className="group rounded-[2rem] border border-[#0a31401a] bg-white p-6 shadow-[0_14px_42px_rgba(7,21,29,0.06)] transition hover:-translate-y-1 hover:shadow-[0_24px_70px_rgba(7,21,29,0.1)]">
      <div className="flex items-start justify-between gap-4">
        <div className="rounded-[1.4rem] bg-[#07151d] p-5 text-white"><FileText className="h-8 w-8" /></div>
        <span className="rounded-full bg-[var(--slot4-gray)] px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em]">{category}</span>
      </div>
      <h2 className="mt-8 font-serif text-2xl font-semibold leading-tight tracking-[-0.05em] text-black">{post.title}</h2>
      <p className="mt-4 line-clamp-4 text-sm leading-7 text-black">{getSummary(post)}</p>
      <p className="mt-6 inline-flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--archive-accent)]">Open document <Download className="h-4 w-4" /></p>
    </Link>
  )
}

function ProfileArchiveCard({ post, href }: { post: SitePost; href: string }) {
  const avatar = getImages(post)[0]
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const location = getField(post, ['location', 'address', 'city'])
  return (
    <Link href={href} className="group overflow-hidden rounded-[2.2rem] border border-black/8 bg-white shadow-[0_18px_48px_rgba(15,23,42,0.07)] transition hover:-translate-y-1 hover:shadow-[0_28px_75px_rgba(15,23,42,0.12)]">
      <div className="h-24 bg-[linear-gradient(135deg,#e9efe0_0%,#cfd7be_100%)]" />
      <div className="relative px-6 pb-6">
        <div className="-mt-14 flex items-end justify-between gap-4">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-[1.9rem] border-4 border-white bg-[#f7f5ed] shadow-[0_12px_30px_rgba(15,23,42,0.12)]">
            {avatar ? <img src={avatar} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-10 w-10 opacity-45" />}
          </div>
          <span className="rounded-full border border-black/10 bg-white px-4 py-2 text-[11px] font-black uppercase tracking-[0.18em] text-black">Profile</span>
        </div>
        <h2 className="mt-5 text-2xl font-black leading-tight tracking-[-0.04em] text-black">{post.title}</h2>
        {role ? <p className="mt-2 text-xs font-black uppercase tracking-[0.18em] text-[#819A91]">{role}</p> : null}
        <div className="mt-4 grid gap-2 text-sm text-black/66">
          {location ? <p className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[#819A91]" /> {location}</p> : null}
          {website ? <p className="inline-flex items-center gap-2 truncate"><Globe2 className="h-4 w-4 text-[#819A91]" /> {website.replace(/^https?:\/\//, '')}</p> : null}
        </div>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-black/72">{getSummary(post)}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <span className="text-xs font-black uppercase tracking-[0.16em] text-[#355148]">View profile</span>
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#111111] text-white"><ArrowRight className="h-4 w-4" /></span>
        </div>
      </div>
    </Link>
  )
}
