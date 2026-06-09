import Link from 'next/link'
import type { CSSProperties } from 'react'
import { notFound } from 'next/navigation'
import { ArrowLeft, Bookmark, Building2, Camera, CheckCircle2, Clock3, Download, ExternalLink, FileText, Globe2, Mail, MapPin, MessageCircle, Phone, Tag, UserRound } from 'lucide-react'
import { buildPostMetadata, buildTaskMetadata } from '@/lib/seo'
import { buildPostUrl, fetchArticleComments, fetchTaskPostBySlug, fetchTaskPosts } from '@/lib/task-data'
import { getTaskConfig, SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import type { SitePost } from '@/lib/site-connector'
import { ProfileHeaderActions } from '@/editable/components/ProfileHeaderActions'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { getVisualPreset, visualSystem } from '@/editable/theme/visual-system'

export const revalidate = 3

export async function generateEditableDetailMetadata(task: TaskKey, params: Promise<{ slug?: string; username?: string }>) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  return post ? await buildPostMetadata(task, post) : await buildTaskMetadata(task)
}

export async function EditableTaskDetailRoute({ task, params }: { task: TaskKey; params: Promise<{ slug?: string; username?: string }> }) {
  const resolved = await params
  const slug = resolved.slug || resolved.username || ''
  const post = await fetchTaskPostBySlug(task, slug)
  if (!post) notFound()
  const related = (await fetchTaskPosts(task, 7)).filter((item) => item.slug !== post.slug).slice(0, 4)
  const comments = task === 'article' ? await fetchArticleComments(post.slug, 50) : []
  return <TaskDetailView task={task} post={post} related={related} comments={comments} />
}

const getContent = (post: SitePost) => (post.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {})
const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '')
const isUrl = (value: string) => value.startsWith('/') || /^https?:\/\//i.test(value)

const getField = (post: SitePost, keys: string[]) => {
  const content = getContent(post)
  for (const key of keys) {
    const value = asText(content[key])
    if (value) return value
  }
  return ''
}

const getImages = (post: SitePost) => {
  const content = getContent(post)
  const media = Array.isArray(post.media) ? post.media.map((item) => item?.url).filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const images = Array.isArray(content.images) ? content.images.filter((url): url is string => typeof url === 'string' && isUrl(url)) : []
  const singleImages = ['image', 'featuredImage', 'thumbnail', 'logo', 'avatar'].map((key) => asText(content[key])).filter((url) => url && isUrl(url))
  return [...media, ...images, ...singleImages].filter(Boolean).slice(0, 12)
}

const getBody = (post: SitePost) => {
  const content = getContent(post)
  return asText(content.body) || asText(content.description) || asText(content.details) || post.summary || 'Details will appear here once available.'
}

const escapeHtml = (value: string) => value
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;')

const safeUrl = (value: string) => /^https?:\/\//i.test(value) ? value : '#'

const linkifyMarkdown = (value: string) => value.replace(/\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/gi, (_match, label, url) => `<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${label}</a>`)
const linkifyText = (value: string) => linkifyMarkdown(value).replace(/(^|[\s(>])((https?:\/\/)[^\s<)]+)/gi, (_match, prefix, url) => `${prefix}<a href="${safeUrl(url)}" target="_blank" rel="nofollow noopener noreferrer">${url}</a>`)
const hardenLinks = (html: string) => html.replace(/<a\s+([^>]*href=["'][^"']+["'][^>]*)>/gi, (_match, attrs) => {
  let next = String(attrs).replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '')
  if (!/\starget=/i.test(next)) next += ' target="_blank"'
  if (!/\srel=/i.test(next)) next += ' rel="nofollow noopener noreferrer"'
  return `<a ${next}>`
})
const sanitizeHtml = (html: string) => hardenLinks(html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '').replace(/<(iframe|object|embed)[^>]*>[\s\S]*?<\/\1>/gi, '').replace(/\s+on\w+=("[^"]*"|'[^']*'|[^\s>]+)/gi, '').replace(/(href|src)=(['"])javascript:[\s\S]*?\2/gi, '$1="#"'))

const formatPlainText = (raw: string) => {
  const value = raw.trim()
  if (!value) return ''
  if (/<[a-z][\s\S]*>/i.test(value)) return sanitizeHtml(linkifyMarkdown(value))
  return value.split(/\n{2,}/).map((part) => `<p>${linkifyText(escapeHtml(part).replace(/\n/g, '<br />'))}</p>`).join('')
}

const summaryText = (post: SitePost) => post.summary || asText(getContent(post).description) || asText(getContent(post).excerpt) || ''
const categoryOf = (post: SitePost, fallback: string) => asText(getContent(post).category) || post.tags?.[0] || fallback
const hostOf = (value: string) => {
  try {
    return new URL(value.startsWith('http') ? value : `https://${value}`).hostname.replace(/^www\./, '')
  } catch {
    return value.replace(/^https?:\/\//, '').replace(/^www\./, '').split('/')[0]
  }
}
const mapSrcFor = (post: SitePost) => {
  const address = getField(post, ['address', 'location', 'city'])
  const lat = getField(post, ['lat', 'latitude'])
  const lng = getField(post, ['lng', 'lon', 'longitude'])
  if (lat && lng) return `https://maps.google.com/maps?q=${encodeURIComponent(`${lat},${lng}`)}&z=14&output=embed`
  if (address) return `https://maps.google.com/maps?q=${encodeURIComponent(address)}&z=13&output=embed`
  return ''
}

export function TaskDetailView({ task, post, related, comments = [] }: { task: TaskKey; post: SitePost; related: SitePost[]; comments?: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  const preset = getVisualPreset(visualSystem.recommendedPreset as any)
  const detailVars = { '--detail-bg': preset.colors.background, '--detail-text': preset.colors.foreground, '--detail-surface': '#ffffff', '--detail-accent': preset.colors.accent } as CSSProperties

  return (
    <EditableSiteShell>
      <main style={detailVars} className="bg-[var(--detail-bg)] text-[var(--detail-text)]">
        {task === 'listing' ? <ListingDetail post={post} related={related} /> : null}
        {task === 'classified' ? <ClassifiedDetail post={post} related={related} /> : null}
        {task === 'image' ? <ImageDetail post={post} related={related} /> : null}
        {task === 'sbm' ? <BookmarkDetail post={post} related={related} /> : null}
        {task === 'pdf' ? <PdfDetail post={post} related={related} /> : null}
        {task === 'profile' ? <ProfileDetail post={post} related={related} /> : null}
        {task === 'article' ? <ArticleDetail post={post} related={related} comments={comments} /> : null}
      </main>
    </EditableSiteShell>
  )
}

function BackLink({ task }: { task: TaskKey }) {
  const taskConfig = getTaskConfig(task)
  return (
    <Link href={taskConfig?.route || '/'} className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/10 px-4 py-2 text-sm font-black text-white backdrop-blur">
      <ArrowLeft className="h-4 w-4" /> Back to {taskConfig?.label || 'posts'}
    </Link>
  )
}

function DetailHero({ task, post, badge }: { task: TaskKey; post: SitePost; badge: string }) {
  const image = getImages(post)[0]
  return (
    <section className="relative overflow-hidden bg-[#140d10] text-white">
      {image ? <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30" /> : null}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(129,154,145,0.24),transparent_28%),linear-gradient(90deg,rgba(20,13,16,0.92),rgba(20,13,16,0.68),rgba(20,13,16,0.9))]" />
      <div className="relative mx-auto grid max-w-[1420px] gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[0.94fr_1.06fr] lg:px-10 lg:py-20">
        <div className="max-w-3xl">
          <BackLink task={task} />
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <span className="rounded-full border border-white/16 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.3em] text-[#D1D8BE]">{badge}</span>
            <span className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-white/62">{getTaskConfig(task)?.label || task}</span>
          </div>
          <h1 className="mt-5 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.07em] sm:text-6xl lg:text-7xl">{post.title}</h1>
          {summaryText(post) ? <p className="mt-6 max-w-2xl text-base leading-8 text-white/74">{summaryText(post)}</p> : null}
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={buildPostUrl(task, post.slug)} className="rounded-[1.3rem] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black">Open page</Link>
            <Link href={getTaskConfig(task)?.route || '/'} className="rounded-[1.3rem] border border-white/14 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">More in section</Link>
          </div>
        </div>
        <div className="grid gap-4 self-center lg:pl-10">
          {[
            ['Image-led rhythm', 'Large media, calmer spacing, and stronger hierarchy keep the page feeling curated.'],
            ['Premium reading flow', 'Details, supporting copy, and related content stay easier to scan at a glance.'],
            ['Clear next actions', 'Visitors can move between sections without the layout feeling generic or crowded.'],
          ].map(([title, body], index) => (
            <div key={title} className={`rounded-[2rem] p-5 ${index === 1 ? 'bg-white text-black' : 'border border-white/10 bg-white/8 text-white backdrop-blur'}`}>
              <p className={`text-sm font-black uppercase tracking-[0.18em] ${index === 1 ? 'text-[#819A91]' : 'text-[#D1D8BE]'}`}>{title}</p>
              <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-black/72' : 'text-white/72'}`}>{body}</p>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              post.publishedAt ? new Date(post.publishedAt).toLocaleDateString() : 'Live',
              badge,
              SITE_CONFIG.name,
            ].map((value, index) => (
              <div key={`${value}-${index}`} className="rounded-[1.5rem] border border-white/10 bg-white/8 px-3 py-4 text-xs font-black uppercase tracking-[0.16em] text-white/78">
                {value}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ArticleDetail({ post, related, comments }: { post: SitePost; related: SitePost[]; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <>
      <DetailHero task="article" post={post} badge={categoryOf(post, 'Article')} />
      <section className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
        <article className="min-w-0 rounded-[2.4rem] border border-[#00000010] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-12">
          <BodyContent post={post} />
          <ImageStrip images={getImages(post).slice(1)} label="More visuals" />
          <EditableComments slug={post.slug} comments={comments} />
        </article>
        <RelatedPanel task="article" post={post} related={related} />
      </section>
    </>
  )
}

function ListingDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const address = getField(post, ['address', 'location', 'city'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  const mapSrc = mapSrcFor(post)
  return (
    <>
      <DetailHero task="listing" post={post} badge="Business listing" />
      <section className="mx-auto max-w-[1320px] px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_400px]">
          <article className="rounded-[2.4rem] border border-[#00000010] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-9">
            <InfoGrid items={[['Location', address, MapPin], ['Phone', phone, Phone], ['Email', email, Mail], ['Website', website, Globe2]]} />
            <BodyContent post={post} />
            <ImageStrip images={images} label="Business showcase" />
          </article>
          <aside className="space-y-5">
            {mapSrc ? <MapBox src={mapSrc} label={address || post.title} /> : null}
            <ContactAction website={website} phone={phone} email={email} />
            <RelatedPanel task="listing" post={post} related={related} compact />
          </aside>
        </div>
      </section>
    </>
  )
}

function ClassifiedDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const price = getField(post, ['price', 'amount', 'budget'])
  const location = getField(post, ['location', 'address', 'city'])
  const condition = getField(post, ['condition', 'availability', 'type'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const email = getField(post, ['email'])
  const website = getField(post, ['website', 'url'])
  return (
    <>
      <DetailHero task="classified" post={post} badge="Classified" />
      <section className="mx-auto grid max-w-[1320px] gap-7 px-4 py-10 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:px-8 lg:py-16">
        <aside className="rounded-[2.4rem] bg-[#140d10] p-7 text-[#EEEFE0] shadow-[0_28px_90px_rgba(0,0,0,0.2)] lg:sticky lg:top-24 lg:self-start">
          <div className="grid gap-3">
            {price ? <BadgeLine label="Price" value={price} /> : null}
            {condition ? <BadgeLine label="Condition" value={condition} /> : null}
            {location ? <BadgeLine label="Location" value={location} /> : null}
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {phone ? <a href={`tel:${phone}`} className="rounded-full bg-[#EEEFE0] px-5 py-3 text-sm font-black text-[#140d10]">Call now</a> : null}
            {email ? <a href={`mailto:${email}`} className="rounded-full border border-white/18 px-5 py-3 text-sm font-black">Email</a> : null}
          </div>
        </aside>
        <article className="rounded-[2.4rem] border border-[#00000010] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-9">
          <ImageStrip images={images} label="Offer images" large />
          <BodyContent post={post} />
          <ContactAction website={website} phone={phone} email={email} />
          <RelatedPanel task="classified" post={post} related={related} />
        </article>
      </section>
    </>
  )
}

function ImageDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const heroImage = images[0] || '/placeholder.svg?height=1200&width=1600'
  const secondaryImages = images.slice(1, 5)
  const galleryImages = images.slice(5)
  return (
    <>
      <section className="bg-[#f3f0e6] px-4 pb-8 pt-6 sm:px-6 lg:px-10 lg:pb-10 lg:pt-8">
        <div className="mx-auto max-w-[1460px]">
          <BackLink task="image" />
        </div>
      </section>

      <section className="bg-[#f3f0e6] px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
        <div className="mx-auto grid max-w-[1460px] gap-6 lg:grid-cols-[1.3fr_0.7fr]">
          <article className="overflow-hidden rounded-[2.8rem] bg-[#101417] text-white shadow-[0_30px_90px_rgba(0,0,0,0.18)]">
            <div className="relative min-h-[460px] sm:min-h-[560px]">
              <img src={heroImage} alt="" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(16,20,23,0.12),rgba(16,20,23,0.82)_70%,rgba(16,20,23,0.96))]" />
              <div className="relative flex min-h-[460px] flex-col justify-end p-6 sm:min-h-[560px] sm:p-8 lg:p-10">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.28em] text-[#D1D8BE]">Image edition</span>
                  <span className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-white/66">{categoryOf(post, 'Visual story')}</span>
                </div>
                <h1 className="mt-5 max-w-4xl text-4xl font-black leading-[0.94] tracking-[-0.06em] sm:text-5xl lg:text-6xl">{post.title}</h1>
                 <p className="mt-5 max-w-2xl text-base leading-8 text-white/74"></p> 
                  <div className="mt-7 flex flex-wrap gap-3">
                  <Link href="/image" className="rounded-[1.35rem] bg-white px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-black">More visuals</Link>
                  <Link href="/search" className="rounded-[1.35rem] border border-white/14 px-5 py-3 text-sm font-black uppercase tracking-[0.16em] text-white">Search collection</Link>
                </div>
              </div>
            </div>
          </article>

          <aside className="grid gap-6">
            <div className="rounded-[2.4rem] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#819A91]">Story notes</p>
              <BodyContent post={post} compact />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                ['Curated frame', 'A cleaner image page with stronger hierarchy and calmer supporting details.'],
                ['Gallery flow', 'Large media leads first, while text and related content stay supportive.'],
              ].map(([title, copy]) => (
                <div key={title} className="rounded-[2rem] border border-black/8 bg-[#e8ecdc] p-5 text-black">
                  <p className="text-sm font-black uppercase tracking-[0.18em] text-[#355148]">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-black/70">{copy}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {secondaryImages.length ? (
        <section className="bg-white px-4 py-10 sm:px-6 lg:px-10 lg:py-14">
          <div className="mx-auto max-w-[1460px]">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.22em] text-[#819A91]">Visual sequence</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.05em] text-black">A second layer of frames</h2>
              </div>
            </div>
            <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr_0.9fr]">
              {secondaryImages.map((image, index) => (
                <figure key={`${image}-${index}`} className={`${index === 0 ? 'lg:row-span-2' : ''} overflow-hidden rounded-[2.2rem] border border-black/8 bg-[#f7f5ed] shadow-[0_18px_45px_rgba(15,23,42,0.08)]`}>
                  <img src={image} alt="" className={`w-full object-cover ${index === 0 ? 'h-full min-h-[520px]' : 'h-[250px]'}`} />
                  <figcaption className="flex items-center justify-between gap-3 p-5">
                    <span className="text-sm font-black text-black">Frame {index + 2}</span>
                    <span className="rounded-full bg-white px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-black">Editorial</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-[#f3f0e6] px-4 py-10 sm:px-6 lg:px-10 lg:py-16">
        <div className="mx-auto grid max-w-[1460px] gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="grid gap-5 md:grid-cols-2">
            {(galleryImages.length ? galleryImages : images.slice(1)).slice(0, 6).map((image, index) => (
              <figure key={`${image}-grid-${index}`} className={`overflow-hidden rounded-[2rem] border border-black/8 bg-white shadow-[0_16px_40px_rgba(15,23,42,0.07)] ${index % 3 === 0 ? 'md:col-span-2' : ''}`}>
                <img src={image} alt="" className={`w-full object-cover ${index % 3 === 0 ? 'h-[360px]' : 'h-[260px]'}`} />
                <figcaption className="p-5 text-sm font-black text-black">Gallery panel {index + 1}</figcaption>
              </figure>
            ))}
          </div>
          <div className="space-y-5">
            <div className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
              <p className="text-xs font-black uppercase tracking-[0.22em] text-[#819A91]">Page details</p>
              <div className="mt-4 grid gap-3 text-sm font-bold text-black/68">
                <p>Collection: {SITE_CONFIG.name}</p>
                <p>Section: {getTaskConfig('image')?.label || 'Image'}</p>
                <p>Status: Published visual page</p>
              </div>
            </div>
            <RelatedPanel task="image" post={post} related={related} />
          </div>
        </div>
      </section>
    </>
  )
}

function BookmarkDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const website = getField(post, ['website', 'url', 'link'])
  return (
    <>
      <DetailHero task="sbm" post={post} badge="Saved resource" />
      <section className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
        <article className="rounded-[2.4rem] border border-[#00000010] bg-white p-7 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-10">
          <div className="flex h-20 w-20 items-center justify-center rounded-[2rem] bg-[#140d10] text-[#EEEFE0]"><Bookmark className="h-9 w-9" /></div>
          {website ? <Link href={website} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 rounded-full bg-[#140d10] px-5 py-3 text-sm font-black text-[#EEEFE0]">Open resource <ExternalLink className="h-4 w-4" /></Link> : null}
          <BodyContent post={post} />
        </article>
        <RelatedPanel task="sbm" post={post} related={related} />
      </section>
    </>
  )
}

function PdfDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const fileUrl = getField(post, ['fileUrl', 'pdfUrl', 'documentUrl', 'url'])
  return (
    <>
      <DetailHero task="pdf" post={post} badge="Document library" />
      <section className="mx-auto grid max-w-[1320px] gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:px-8 lg:py-16">
        <article className="rounded-[2.4rem] border border-[#00000010] bg-white p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] sm:p-9">
          <BodyContent post={post} />
          {fileUrl ? (
            <div className="mt-8 overflow-hidden rounded-[2rem] border border-[#00000010] bg-[var(--detail-bg)]">
              <div className="flex items-center justify-between gap-3 border-b border-[#00000010] bg-white p-4">
                <span className="text-sm font-black">Document preview</span>
                <Link href={fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#140d10] px-4 py-2 text-xs font-black text-[#EEEFE0]">Download <Download className="h-4 w-4" /></Link>
              </div>
              <iframe src={`${fileUrl}#toolbar=0&navpanes=0&scrollbar=0`} title={post.title} className="h-[78vh] w-full" />
            </div>
          ) : null}
        </article>
        <RelatedPanel task="pdf" post={post} related={related} />
      </section>
    </>
  )
}

function ProfileDetail({ post, related }: { post: SitePost; related: SitePost[] }) {
  const images = getImages(post)
  const role = getField(post, ['role', 'designation', 'company', 'location'])
  const website = getField(post, ['website', 'url'])
  const email = getField(post, ['email'])
  const phone = getField(post, ['phone', 'telephone', 'mobile'])
  const location = getField(post, ['location', 'address', 'city'])
  const tags = (post.tags || []).filter(Boolean).slice(0, 5)
  const stats = [
    { label: 'visuals', value: String(images.length || 0) },
    { label: 'tags', value: String(tags.length || 0) },
    { label: 'links', value: String([website, email, phone].filter(Boolean).length) },
    { label: 'related', value: String(related.length || 0) },
  ]
  const badges = [
    { title: 'Presence', tone: 'bg-[#f4e5b6] text-[#7d5b00]', note: role || 'Profile registered' },
    { title: 'Identity', tone: 'bg-[#eceff1] text-[#5c6670]', note: location || 'Location pending' },
    { title: 'Connection', tone: 'bg-[#efe9dc] text-[#7a5a3c]', note: website ? hostOf(website) : 'External link ready' },
  ]
  return (
    <>
      <section className="bg-[#f4f1e8] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        <div className="mx-auto max-w-[1460px]">
         </div>
      </section>

      <section className="bg-[#f4f1e8] px-4 pb-12 sm:px-6 lg:px-10 lg:pb-16">
        <div className="mx-auto max-w-[1460px] rounded-[2.8rem] border border-black/8 bg-white p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[160px_minmax(0,1fr)_auto] lg:items-start">
            <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-[2rem] border border-black/8 bg-[#f7f5ed] shadow-[0_12px_30px_rgba(15,23,42,0.1)] sm:h-36 sm:w-36">
              {images[0] ? <img src={images[0]} alt="" className="h-full w-full object-cover" /> : <UserRound className="h-16 w-16 opacity-45" />}
            </div>
            <div className="min-w-0">
              <h1 className="max-w-4xl text-4xl font-black leading-[0.98] tracking-[-0.06em] text-black sm:text-5xl">{post.title}</h1>
             </div>
            <ProfileHeaderActions />
          </div>

          <div className="mt-8 flex flex-wrap gap-5 border-b border-black/8 pb-4 text-sm font-semibold text-black/72">
            <span className="rounded-full bg-[#8f2b24] px-4 py-2 font-black text-white">Profile</span>
            <span className="px-2 py-2"></span>
          </div>
        </div>
      </section>

      <section className="bg-[#f4f1e8] px-4 pb-16 sm:px-6 lg:px-10">
        <div className="mx-auto grid max-w-[1460px] gap-7 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-6">
            

          
          </aside>

          <div className="space-y-7">
            <article className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
              <h2 className="text-3xl font-black tracking-[-0.05em] text-black">About</h2>
              <BodyContent post={post} />
            </article>

            <section className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
              <h2 className="text-3xl font-black tracking-[-0.05em] text-black">Badges</h2>
              <div className="mt-6 grid gap-5 lg:grid-cols-3">
                {badges.map((badge) => (
                  <div key={badge.title} className="rounded-[1.7rem] border border-black/8 bg-[#faf8f2] p-6">
                    <div className={`inline-flex rounded-full px-4 py-2 text-xs font-black uppercase tracking-[0.18em] ${badge.tone}`}>{badge.title}</div>
                    <p className="mt-5 text-lg font-black text-black">{badge.note}</p>
                  </div>
                ))}
              </div>
            </section>

            {(images.slice(1).length || related.length) ? (
              <section className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
                <h2 className="text-3xl font-black tracking-[-0.05em] text-black">Posts</h2>
                <div className="mt-6 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                  <div>
                    <ImageStrip images={images.slice(1)} label="Profile gallery" />
                  </div>
                  <div className="space-y-5">
                    <ContactAction website={website}  />
                     </div>
                </div>
              </section>
            ) : (
              <section className="rounded-[2rem] border border-black/8 bg-white p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)] sm:p-8">
                <ContactAction website={website} phone={phone} email={email} />
              </section>
            )}
          </div>
        </div>
      </section>
    </>
  )
}

function BodyContent({ post, compact = false }: { post: SitePost; compact?: boolean }) {
  return <div className={`article-content mt-8 max-w-none ${compact ? 'text-base leading-8' : 'text-lg leading-9'} text-black/72`} dangerouslySetInnerHTML={{ __html: formatPlainText(getBody(post)) }} />
}

function InfoGrid({ items }: { items: Array<[string, string, typeof MapPin]> }) {
  const visible = items.filter(([, value]) => value)
  if (!visible.length) return null
  return (
    <div className="mt-2 grid gap-3 sm:grid-cols-2">
      {visible.map(([label, value, Icon]) => (
        <div key={label} className="rounded-[1.5rem] border border-[#00000010] bg-[var(--detail-bg)] p-4">
          <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.16em] text-[var(--detail-accent)]"><Icon className="h-4 w-4" /> {label}</div>
          <p className="mt-2 break-words text-sm font-bold leading-6 text-[var(--slot4-muted-text)]">{value}</p>
        </div>
      ))}
    </div>
  )
}

function ImageStrip({ images, label, large = false }: { images: string[]; label: string; large?: boolean }) {
  if (!images.length) return null
  return (
    <section className="mt-8">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#819A91]">{label}</p>
      <div className={`mt-4 grid gap-3 ${large ? 'sm:grid-cols-2' : 'grid-cols-2 sm:grid-cols-4'}`}>
        {images.slice(0, large ? 4 : 8).map((image, index) => <img key={`${image}-${index}`} src={image} alt="" className="aspect-[4/3] rounded-[1.4rem] object-cover ring-1 ring-[#00000010] shadow-[0_14px_34px_rgba(15,23,42,0.08)]" />)}
      </div>
    </section>
  )
}

function MapBox({ src, label }: { src: string; label: string }) {
  return (
    <div className="overflow-hidden rounded-[2rem] border border-[#00000010] bg-white shadow-sm">
      <div className="flex items-center gap-2 p-4 text-sm font-black"><MapPin className="h-4 w-4" /> {label || 'Map location'}</div>
      <iframe src={src} title="Map" loading="lazy" className="h-80 w-full border-0" />
    </div>
  )
}

function ContactAction({ website, phone, email }: { website?: string; phone?: string; email?: string }) {
  if (!website && !phone && !email) return null
  return (
    <div className="mt-5 rounded-[2rem] border border-[#00000010] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-black uppercase tracking-[0.22em] text-[#819A91]">Quick actions</p>
      <div className="mt-4 flex flex-wrap gap-3">
        {website ? <Link href={website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-[#111111] px-4 py-3 text-sm font-black text-white">Website <ExternalLink className="h-4 w-4" /></Link> : null}
        {phone ? <a href={`tel:${phone}`} className="inline-flex items-center gap-2 rounded-full border border-[#00000010] bg-[#f7f5ed] px-4 py-3 text-sm font-black text-black"><Phone className="h-4 w-4" /> Call</a> : null}
        {email ? <a href={`mailto:${email}`} className="inline-flex items-center gap-2 rounded-full border border-[#00000010] bg-[#f7f5ed] px-4 py-3 text-sm font-black text-black"><Mail className="h-4 w-4" /> Email</a> : null}
      </div>
    </div>
  )
}

function BadgeLine({ label, value }: { label: string; value: string }) {
  return <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 text-sm"><span className="font-black uppercase tracking-[0.16em] opacity-60">{label}</span><span className="font-black">{value}</span></div>
}

function RelatedPanel({ task, post, related, compact = false }: { task: TaskKey; post: SitePost; related: SitePost[]; compact?: boolean }) {
  const taskConfig = getTaskConfig(task)
  return (
    <aside className="min-w-0 space-y-5">
      {related.length ? (
        <div className="rounded-[2rem] border border-[#00000010] bg-white p-5 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-2xl font-black tracking-[-0.04em] text-black">More like this</h2>
            <Link href={taskConfig?.route || '/'} className="text-xs font-black uppercase tracking-[0.16em] text-[#819A91]">View all</Link>
          </div>
          <div className="mt-5 grid gap-3">
            {related.map((item) => <RelatedCard key={item.id || item.slug} task={task} post={item} />)}
          </div>
        </div>
      ) : null}
    </aside>
  )
}

function RelatedCard({ task, post }: { task: TaskKey; post: SitePost }) {
  const image = getImages(post)[0]
  return (
    <Link href={buildPostUrl(task, post.slug)} className="group flex gap-3 rounded-2xl border border-[#00000010] bg-[#f7f5ed] p-3 transition hover:-translate-y-0.5 hover:shadow-lg">
      {image && task !== 'sbm' ? <img src={image} alt="" className="h-20 w-20 shrink-0 rounded-xl object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl bg-white"><FileText className="h-6 w-6 opacity-45" /></div>}
      <div className="min-w-0">
        <h3 className="line-clamp-3 text-sm font-black leading-tight tracking-[-0.03em] text-black">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-xs leading-5 text-black/62">{summaryText(post)}</p>
      </div>
    </Link>
  )
}

function EditableComments({ slug, comments }: { slug: string; comments: Array<{ id: string; name: string; comment: string; createdAt: string }> }) {
  return (
    <section className="mt-10 rounded-[2rem] border border-[#00000010] bg-[#f7f5ed] p-5">
      <div className="flex items-center gap-2 text-2xl font-black text-black"><MessageCircle className="h-5 w-5" /> Comments</div>
      <div className="mt-5 grid gap-3">
        {comments.slice(0, 5).map((comment) => (
          <div key={comment.id} className="rounded-2xl border border-[#00000010] bg-white p-4">
            <p className="text-sm font-black text-black">{comment.name}</p>
            <p className="mt-2 text-sm leading-6 text-black/72">{comment.comment}</p>
          </div>
        ))}
        {!comments.length ? <p className="text-sm text-black/56">No comments yet for {slug}.</p> : null}
      </div>
    </section>
  )
}
