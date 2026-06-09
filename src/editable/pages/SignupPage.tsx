import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalSignupForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/signup', title: 'Sign up', description: pagesContent.auth.signup.metadataDescription })
}

export default function SignupPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f4f4ec] text-black">
        <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-[1480px] items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-10 lg:py-14">
          <div className="rounded-[2.2rem] border border-black/6 bg-white p-6 text-black shadow-[0_24px_70px_rgba(20,13,16,0.1)] sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#819A91]">Start publishing</p>
                <h1 className="mt-3 text-3xl font-black tracking-[-0.05em] text-black">{pagesContent.auth.signup.formTitle}</h1>
              </div>
              <Link href="/login" className="rounded-full border border-black/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-black transition hover:border-[#819A91] hover:bg-[#f7f5ed]">Existing member</Link>
            </div>
            <EditableLocalSignupForm />
            <div className="mt-6 rounded-[1.6rem] bg-[#f7f5ed] p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-black">Explore first</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/image" className="rounded-full bg-[#111111] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5">Browse visuals</Link>
                <Link href="/about" className="rounded-full border border-black/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:-translate-y-0.5 hover:border-[#819A91]">Why ZEOTHEORY</Link>
              </div>
            </div>
            <p className="mt-5 text-sm text-black/64">Already have an account? <Link href="/login" className="font-black text-black underline-offset-4 hover:underline">{pagesContent.auth.signup.loginCta}</Link></p>
          </div>

          <div className="overflow-hidden rounded-[2.6rem] bg-[linear-gradient(135deg,#ede8d6_0%,#dbe4cf_36%,#9aaea1_100%)] p-8 text-black shadow-[0_32px_110px_rgba(20,13,16,0.12)] sm:p-10 lg:p-12">
            <p className="text-xs font-black uppercase tracking-[0.28em] text-[#355148]">{pagesContent.auth.signup.badge}</p>
            <h2 className="mt-5 max-w-2xl text-5xl font-black leading-[0.98] tracking-[-0.07em] text-black sm:text-6xl">{pagesContent.auth.signup.title}</h2>
            <p className="mt-6 max-w-xl text-lg leading-8 text-black/72">{pagesContent.auth.signup.description}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['Personal account', 'Save your place and move between visual sections with less friction.'],
                ['Profile-ready', 'Built for image-led pages and profile discovery from the start.'],
                ['Editorial feel', 'Cleaner hierarchy and stronger contrast make the whole journey easier to use.'],
              ].map(([title, body], index) => (
                <div key={title} className={`rounded-[1.8rem] p-5 ${index === 1 ? 'bg-[#111111] text-white' : 'bg-white/72 text-black'}`}>
                  <p className={`text-sm font-black uppercase tracking-[0.16em] ${index === 1 ? 'text-[#D1D8BE]' : 'text-[#355148]'}`}>{title}</p>
                  <p className={`mt-3 text-sm leading-7 ${index === 1 ? 'text-white/76' : 'text-black/70'}`}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
