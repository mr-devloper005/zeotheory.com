import Link from 'next/link'
import { ArrowRight, Image as ImageIcon, Play, SquareStack, UserRound, Video } from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { CompactIndexCard, EditorialFeatureCard, RailPostCard, getEditableExcerpt, getEditablePostImage, postHref } from '@/editable/cards/PostCards'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function HeroSpotlight({ posts }: { posts: SitePost[] }) {
  const lead = posts[0]
  return (
    <div className="relative min-h-[620px] overflow-hidden rounded-[2rem]">
      <img src={getEditablePostImage(lead)} alt={lead?.title || ''} className="absolute inset-0 h-full w-full object-cover opacity-45" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_24%),linear-gradient(90deg,rgba(75,24,38,0.68),rgba(75,24,38,0.3),rgba(75,24,38,0.72))]" />
    </div>
  )
}

export function EditableHomeHero({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  return (
    <section className="bg-[#4b1826] text-white">
      <div className="mx-auto grid max-w-[1480px] gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-16">
        <div className="relative z-10 self-center">
          
          <h1 className="mt-8 max-w-4xl text-5xl font-black leading-[0.94] tracking-[-0.07em] sm:text-6xl lg:text-[5.4rem]">
            The creative platform to direct your best work
          </h1>
          <p className="mt-8 max-w-2xl text-xl leading-9 text-white/84">
            Every image set and visual story in one polished workflow with stronger browsing, cleaner presentation, and elegant momentum.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href={primaryRoute} className="rounded-2xl bg-white px-7 py-4 text-lg font-black text-[#140d10]">Start creating</Link>
            <Link href="/about" className="inline-flex items-center gap-3 rounded-2xl border border-white/18 bg-transparent px-7 py-4 text-lg font-black text-white">
              <Play className="h-4 w-4 fill-current" /> Why ZeoTheory?
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <HeroSpotlight posts={posts} />
          <div className="flex flex-col justify-center gap-5 text-[2.75rem] font-black leading-[1.06] tracking-[-0.06em] text-white/26">
            {['Stay on brand', 'Upscale to 4K', 'Draft storyboards', 'Scale campaigns', 'Generate images', 'Shoot cinematic videos', 'Build workflows'].map((line, index) => (
              <div key={line} className={index === 3 ? 'flex items-center gap-4 text-white' : ''}>
                {index === 3 ? <span className="text-[#ff4fb0]">▶</span> : null}
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1480px] px-4 pb-12 text-center sm:px-6 lg:px-10">
        <p className="text-base font-semibold text-white/84">Trusted by inspired creators, curated collections, and image-led studios</p>
        <div className="mt-8 grid grid-cols-2 gap-6 text-3xl font-black text-white/34 sm:grid-cols-3 lg:grid-cols-6">
          {['CocaCola', 'Ogilvy', 'R/GA', 'Wonder', 'GUESS', 'DeliveryHero'].map((name) => <div key={name}>{name}</div>)}
        </div>
      </div>
    </section>
  )
}

export function EditableStoryRail({ primaryTask, primaryRoute, posts }: HomeSectionProps) {
  const railPosts = posts.slice(0, 8)
  if (!railPosts.length) return null
  return (
    <section className="bg-[#f8f8f0]">
      <div className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-black tracking-[-0.06em] text-[#2a0d12] sm:text-6xl">One place to create anything</h2>
          <p className="mt-5 text-2xl text-[#5f3c3a]">Pick your starting point. Every tool, every model, every format.</p>
        </div>
        <div className="mx-auto mt-10 flex w-fit flex-wrap gap-0 rounded-full bg-white p-0 shadow-sm">
          {['Creative Suite'].map((tab, index) => (
            <span key={tab} className={`rounded-full px-8 py-4 text-lg font-black ${index === 0 ? 'bg-[#1b1b1b] text-white' : 'text-[#2a0d12]'}`}>{tab}</span>
          ))}
        </div>
        <div className="mt-8 grid gap-8 rounded-[2rem] bg-[linear-gradient(135deg,#3b332f_0%,#2f2826_100%)] p-10 text-white lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <h3 className="max-w-md text-4xl font-black tracking-[-0.05em]">Pro-level production, end to end</h3>
            <p className="mt-5 max-w-md text-xl leading-9 text-white/68">
              Start with an idea. Direct the shots. Explore workflows. Connect image, video, and profile storytelling in one place.
            </p>
            <Link href={primaryRoute} className="mt-8 inline-flex items-center gap-3 text-xl font-black text-white">Take a tour <ArrowRight className="h-5 w-5" /></Link>
            <div className="mt-16 grid gap-5 text-2xl font-black text-white/90">
              <div className="flex items-center gap-4 border-b border-white/14 pb-5"><ImageIcon className="h-6 w-6" /> Image</div>
              <div className="flex items-center gap-4"><Video className="h-6 w-6" /> Video</div>
              <div className="flex items-center gap-4"><SquareStack className="h-6 w-6" /> Collections</div>
              <div className="flex items-center gap-4"><UserRound className="h-6 w-6" /> Profiles</div>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[1.6rem] bg-black/20 p-4">
            <div className="grid min-h-[540px] gap-4 lg:grid-cols-[1fr_300px]">
              <img src={getEditablePostImage(posts[1] || posts[0])} alt="" className="h-full w-full rounded-[1.4rem] object-cover" />
              <div className="rounded-[1.4rem] bg-[#1e1b1f] p-5 text-left shadow-[0_20px_60px_rgba(0,0,0,0.2)]">
                <p className="text-sm font-semibold text-white/55">Tools</p>
                <p className="mt-2 text-2xl font-black">Image Generator</p>
                <div className="mt-6 rounded-xl bg-white/5 p-4">
                  <p className="text-xs font-black uppercase text-white/45">Prompt</p>
                  <p className="mt-3 text-base leading-7 text-white/78">
                    Cinematic shot of a premium visual story, rich contrast, elegant motion blur, editorial lighting, and modern gallery styling.
                  </p>
                </div>
                <div className="mt-6 rounded-2xl bg-white/8 px-4 py-4 text-center text-sm font-black text-white/50">Generating preview</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10 flex snap-x gap-5 overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {railPosts.map((post, index) => (
            <RailPostCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const curated = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts
  return (
    <section className="bg-[#f4f4ec]">
      <div className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-5xl font-black tracking-[-0.06em] text-[#2a0d12] sm:text-6xl">With all the latest models</h2>
          <p className="mt-5 text-2xl text-[#5f3c3a]">Get access to image-first tools and profile-ready publishing without losing the easiest workflow.</p>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-2 md:grid-cols-4 xl:grid-cols-8">
          {['Frame 2', 'Grok Imagine', 'Happyhorse 1', 'Krea 2', 'Veo 3', 'Seedream 5', 'Seedance 2', 'Flux 2'].map((name) => (
            <div key={name} className="flex min-h-[170px] items-center justify-center border border-[#2a18140d] bg-white px-4 text-center text-xl font-black text-[#4b1826]">
              {name}
            </div>
          ))}
        </div>
        <div className="mt-20 grid gap-4 lg:grid-cols-[0.68fr_1.32fr]">
          <div className="pt-10">
            <h3 className="max-w-md text-5xl font-black tracking-[-0.06em] text-[#2a0d12]">Start simple. Scale when you're ready</h3>
            <p className="mt-4 max-w-md text-2xl leading-9 text-[#5f3c3a]">From a single image-led tool to a complete workflow, at your own pace.</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-[0.52fr_0.48fr]">
            <div className="rounded-[1.6rem] bg-[#dededb] p-8">
              <h4 className="text-4xl font-black tracking-[-0.05em] text-[#1f1a1c]">Every tool, ready to go</h4>
              <p className="mt-5 text-xl leading-8 text-[#4e4b4c]">Open what you need, make what you want, and move from images to profiles to campaign-ready pages with less friction.</p>
              <img src={getEditablePostImage(curated[0])} alt="" className="mt-8 h-[440px] w-full rounded-[1.4rem] object-cover" />
            </div>
            <div className="grid gap-4">
              <div className="rounded-[1.6rem] bg-[#111014] p-8 text-white">
                <h4 className="text-4xl font-black tracking-[-0.05em]">Your entire creative process on one canvas</h4>
                <p className="mt-5 text-xl leading-8 text-white/72">All your tools. All your workflows. One cleaner space for rich visual publishing.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.6rem] bg-[#5e0a0a] p-8 text-white">
                  <h4 className="text-3xl font-black tracking-[-0.04em]">One place, whole team</h4>
                  <img src={getEditablePostImage(curated[1] || curated[0])} alt="" className="mt-8 h-52 w-full rounded-[1.2rem] object-cover" />
                </div>
                <div className="rounded-[1.6rem] bg-[#156082] p-8 text-white">
                  <h4 className="text-3xl font-black tracking-[-0.04em]">Workflow in one click</h4>
                  <img src={getEditablePostImage(curated[2] || curated[0])} alt="" className="mt-8 h-52 w-full rounded-[1.2rem] object-cover" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const curated = timeSections.flatMap((section) => section.posts).length ? timeSections.flatMap((section) => section.posts) : posts
  const feature = curated[0] || posts[0]
  return (
    <section className="bg-[#f8f8f0]">
      <div className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="max-w-4xl text-5xl font-black tracking-[-0.06em] text-[#2a0d12] sm:text-6xl">From product shot to viral phenomenon</h2>
            <p className="mt-5 max-w-4xl text-2xl leading-9 text-[#5f3c3a]">Global visual campaigns, product stories, and standout gallery publishing across every format.</p>
          </div>
          <Link href={primaryRoute} className="rounded-2xl bg-[#1b1b1b] px-8 py-4 text-xl font-black text-white">Start creating →</Link>
        </div>
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {[0, 1, 2].map((index) => {
            const post = curated[index] || feature
            return (
              <Link key={post?.id || index} href={post ? postHref(primaryTask, post, primaryRoute) : primaryRoute} className="group block overflow-hidden rounded-[1.4rem]">
                <img src={getEditablePostImage(post)} alt={post?.title || ''} className="h-[420px] w-full object-cover transition duration-500 group-hover:scale-105" />
              </Link>
            )
          })}
        </div>
        {feature ? <div className="mt-10"><EditorialFeatureCard post={feature} href={postHref(primaryTask, feature, primaryRoute)} label="Filmmaking" /></div> : null}
        <div className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {curated.slice(3, 9).map((post, index) => (
            <CompactIndexCard key={post.id || post.slug || index} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function EditableHomeCta() {
  return (
    <section className="bg-[#f4f4ec]">
      <div className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-[#819A91]">{pagesContent.home.cta.badge}</p>
            <h2 className="mt-4 max-w-4xl text-5xl font-black tracking-[-0.06em] text-[#2a0d12] sm:text-6xl">Made for visual-first publishing that still feels premium on every route.</h2>
          </div>
          <div className="flex gap-4">
            <Link href="/image" className="rounded-2xl bg-[#1b1b1b] px-8 py-4 text-xl font-black text-white">Get Started</Link>
            <Link href="/contact" className="rounded-2xl border border-[#2a18141a] bg-white px-8 py-4 text-xl font-black text-[#2a0d12]">Contact</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
