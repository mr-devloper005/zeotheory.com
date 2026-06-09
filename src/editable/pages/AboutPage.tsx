import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f4f4ec] text-[#241314]">
        <section className="bg-[linear-gradient(135deg,#140d10_0%,#2d141f_58%,#4b1826_100%)] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto grid max-w-[1480px] gap-10 lg:grid-cols-[1fr_0.92fr] lg:items-center">
            <article>
              <p className="text-[11px] font-black uppercase tracking-[0.32em] text-[#A7C1A8]">{pagesContent.about.badge}</p>
              <h1 className="mt-5 max-w-5xl text-5xl font-black tracking-[-0.06em] sm:text-6xl lg:text-7xl">About {SITE_CONFIG.name}</h1>
              <p className="mt-6 max-w-3xl text-lg leading-9 text-white/76">{pagesContent.about.description}</p>
              <div className="mt-8 space-y-4 text-base leading-8 text-white/74">
                {pagesContent.about.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              </div>
              <div className="mt-10 flex flex-wrap gap-4">
                <Link href="/image" className="rounded-2xl bg-white px-6 py-4 text-sm font-black uppercase tracking-[0.12em] text-[#140d10]">Explore visuals</Link>
              </div>
            </article>

            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Image-led flows', 'Built to give galleries, posts, and visual pages more presence.'],
                ['Purposeful structure', 'Different content types can feel distinct without losing consistency.'],
                ['Cleaner actions', 'Buttons, filters, and navigation stay easier to understand at a glance.'],
                ['Stronger discovery', 'Visitors can move between sections without the experience feeling fragmented.'],
              ].map(([title, body], index) => (
                <div key={title} className={`rounded-[2rem] p-6 shadow-[0_18px_50px_rgba(0,0,0,0.12)] ${index % 2 === 0 ? 'bg-white text-[#111111]' : 'bg-white/10 text-white backdrop-blur'}`}>
                  <h2 className="text-2xl font-black tracking-[-0.04em]">{title}</h2>
                  <p className={`mt-3 text-sm leading-7 ${index % 2 === 0 ? 'text-black/72' : 'text-white/74'}`}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
          <div className="mx-auto max-w-[1480px]">
            <div className="grid gap-5 lg:grid-cols-3">
              {pagesContent.about.values.map((value, index) => (
                <div key={value.title} className={`rounded-[2rem] p-8 shadow-[0_18px_50px_rgba(20,13,16,0.08)] ${index === 1 ? 'bg-[#819A91] text-white' : 'bg-white text-black'}`}>
                  <p className={`text-xs font-black uppercase tracking-[0.24em] ${index === 1 ? 'text-white/70' : 'text-[#819A91]'}`}>Focus area</p>
                  <h2 className="mt-4 text-3xl font-black tracking-[-0.05em]">{value.title}</h2>
                  <p className={`mt-4 text-base leading-8 ${index === 1 ? 'text-white/78' : 'text-black/72'}`}>{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
