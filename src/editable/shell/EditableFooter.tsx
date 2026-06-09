'use client'

import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const taskLinks = SITE_CONFIG.tasks.filter((task) => task.enabled)
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[#0d0b0d] text-[#EEEFE0]">
      <div className="mx-auto max-w-[1480px] px-4 py-20 sm:px-6 lg:px-10">
        <div className="grid gap-10 border-t border-white/10 pt-10 lg:grid-cols-[1.25fr_0.8fr_0.8fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3">
              <Image src="/favico.png" alt={`${SITE_CONFIG.name} logo`} width={240} height={64} className="h-12 w-auto object-contain" />
              <span className="text-3xl font-black tracking-[-0.05em] text-white">{SITE_CONFIG.name}</span>
            </Link>
            <h2 className="mt-5 max-w-xl text-5xl font-black tracking-[-0.06em]">A creative surface for image-first stories and premium discovery.</h2>
            <p className="mt-6 max-w-lg text-lg leading-8 text-white/68">{globalContent.footer.description}</p>
          </div>

          

          <div>
            <h3 className="text-sm font-black uppercase tracking-[0.28em] text-white/45">Account</h3>
            <div className="mt-5 grid gap-3">
              <Link href="/about" className="text-lg font-semibold text-white/78 hover:text-white">About</Link>
              <Link href="/contact" className="text-lg font-semibold text-white/78 hover:text-white">Contact</Link>
              <Link href="/search" className="text-lg font-semibold text-white/78 hover:text-white">Search</Link>
              {session ? <Link href="/create" className="text-lg font-semibold text-white/78 hover:text-white">Create</Link> : <Link href="/login" className="text-lg font-semibold text-white/78 hover:text-white">Log In</Link>}
              {session ? <button type="button" onClick={logout} className="text-left text-lg font-semibold text-white/78 hover:text-white">Log out</button> : <Link href="/signup" className="text-lg font-semibold text-white/78 hover:text-white">Sign up</Link>}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 text-sm text-white/45 sm:flex-row sm:items-center sm:justify-between">
          <p>{globalContent.footer.bottomNote}</p>
          <p>© {year} {SITE_CONFIG.name}. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
