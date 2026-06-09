import type { Metadata } from 'next'
import Link from 'next/link'
import { buildPageMetadata } from '@/lib/seo'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { EditableLocalLoginForm } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata({ path: '/login', title: 'Login', description: pagesContent.auth.login.metadataDescription })
}

export default function LoginPage() {
  return (
    <EditableSiteShell>
      <main className="bg-[#f4f4ec] text-black">
        <section className="mx-auto grid min-h-[calc(100vh-9rem)] max-w-[1480px] items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:px-10 lg:py-14">
          <div className="overflow-hidden rounded-[2.6rem] bg-[radial-gradient(circle_at_top,#5b2030_0%,#2a141d_46%,#110d10_100%)] p-8 text-white shadow-[0_32px_110px_rgba(0,0,0,0.2)] sm:p-10 lg:p-12">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/14 bg-white/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.24em] text-[#D1D8BE]">{pagesContent.auth.login.badge}</span>
              <span className="rounded-full border border-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-white/68">Member access</span>
            </div>
            <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[0.96] tracking-[-0.07em] sm:text-6xl">{pagesContent.auth.login.title}</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/76">{pagesContent.auth.login.description}</p>

            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              {[
                ['Visual publishing', 'Open galleries, posts, and curated sections through one calmer workflow.'],
                ['Profile discovery', 'Move from sign-in to profile-led browsing without losing context.'],
                ['Editorial pace', 'Designed to feel premium, clean, and easier to scan on every screen.'],
              ].map(([title, body]) => (
                <div key={title} className="rounded-[1.8rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                  <p className="text-sm font-black uppercase tracking-[0.16em] text-[#D1D8BE]">{title}</p>
                  <p className="mt-3 text-sm leading-7 text-white/72">{body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2.2rem] border border-black/6 bg-white p-6 text-black shadow-[0_24px_70px_rgba(20,13,16,0.1)] sm:p-8 lg:p-9">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.24em] text-[#819A91]">Secure sign in</p>
                <h2 className="mt-3 text-3xl font-black tracking-[-0.04em] text-black">{pagesContent.auth.login.formTitle}</h2>
              </div>
              <Link href="/signup" className="rounded-full border border-black/10 px-4 py-2 text-[11px] font-black uppercase tracking-[0.22em] text-black transition hover:border-[#819A91] hover:bg-[#f7f5ed]">New member</Link>
            </div>
            <EditableLocalLoginForm />
            <div className="mt-6 rounded-[1.6rem] bg-[#f7f5ed] p-5">
              <p className="text-sm font-black uppercase tracking-[0.2em] text-black">Quick paths</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <Link href="/signup" className="rounded-full bg-[#111111] px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-white transition hover:-translate-y-0.5">Create account</Link>
                <Link href="/contact" className="rounded-full border border-black/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:-translate-y-0.5 hover:border-[#819A91]">Contact</Link>
                <Link href="/about" className="rounded-full border border-black/10 px-4 py-3 text-xs font-black uppercase tracking-[0.18em] text-black transition hover:-translate-y-0.5 hover:border-[#819A91]">About platform</Link>
              </div>
            </div>
            <p className="mt-5 text-sm text-black/64">New here? <Link href="/signup" className="font-black text-black underline-offset-4 hover:underline">{pagesContent.auth.login.createCta}</Link></p>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
