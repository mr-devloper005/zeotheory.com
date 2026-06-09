'use client'

import { useMemo, useState, type CSSProperties } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { LogIn, Menu, Search, UserPlus, X } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableNavbar() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const { session, logout } = useEditableLocalAuthSession()
  const navItems = useMemo(
    () => [
      { label: 'Creative Suite', href: '/image' },
      // { label: 'Profiles', href: '/profile' },
      // { label: 'Resources', href: '/article' },
      // { label: 'Enterprise', href: '/listing' },
      { label: 'Pricing', href: '/contact' },
    ],
    [],
  )

  const navVars = {
    '--editable-nav-bg': '#140d10',
    '--editable-nav-text': '#EEEFE0',
    '--editable-nav-border': 'rgba(238,239,224,0.08)',
  } as CSSProperties

  return (
    <>
      
      <header style={navVars} className="sticky top-0 z-50 border-b border-[var(--editable-nav-border)] bg-[var(--editable-nav-bg)] text-[var(--editable-nav-text)]">
        <nav className="mx-auto flex min-h-[84px] w-full max-w-[1480px] items-center gap-4 px-4 sm:px-6 lg:px-10">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <Image src="/favico.png" alt={`${SITE_CONFIG.name} logo`} width={220} height={60} className="h-11 w-auto object-contain" priority />
            <span className="text-2xl font-black tracking-[-0.05em] text-white">{SITE_CONFIG.name}</span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {navItems.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`)
              return (
                <Link key={item.href} href={item.href} className={`text-lg font-semibold transition ${active ? 'text-white' : 'text-white/84 hover:text-white'}`}>
                  {item.label}
                </Link>
              )
            })}
          </div>

          <div className="ml-auto hidden items-center gap-6 lg:flex">
            <form action="/search">
              <label className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/[0.03] px-4 py-3 text-white/70">
                <Search className="h-4 w-4" />
                <input name="q" type="search" placeholder="Search or create" className="w-36 bg-transparent text-sm font-semibold outline-none placeholder:text-white/45 xl:w-44" />
              </label>
            </form>
            {session ? (
              <>
                <button type="button" onClick={logout} className="text-base font-black text-white/84 hover:text-white">Log out</button>
                <Link href="/create" className="rounded-2xl bg-white px-6 py-3 text-base font-black text-[#140d10]">Create</Link>
              </>
            ) : (
              <>
                <Link href="/login" className="inline-flex items-center gap-2 text-base font-black text-white/84 hover:text-white"><LogIn className="h-4 w-4" /> Log in</Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 text-base font-black text-[#140d10]"><UserPlus className="h-4 w-4" /> Sign up</Link>
              </>
            )}
          </div>

          <button type="button" onClick={() => setOpen((value) => !value)} className="ml-auto inline-flex rounded-2xl border border-white/12 bg-white/5 p-3 text-white lg:hidden" aria-label="Toggle menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open ? (
          <div className="border-t border-white/10 bg-[#140d10] px-4 py-4 lg:hidden">
            <form action="/search" className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
              <Search className="h-4 w-4 text-white/65" />
              <input name="q" type="search" placeholder="Search or create" className="min-w-0 flex-1 bg-transparent text-sm font-semibold text-white outline-none placeholder:text-white/45" />
            </form>
            <div className="mt-4 grid gap-2">
              {[{ label: 'Home', href: '/' }, ...navItems].map((item) => (
                <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/88">
                  {item.label}
                </Link>
              ))}
              {session ? (
                <>
                  <Link href="/create" onClick={() => setOpen(false)} className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#140d10]">Create</Link>
                  <button type="button" onClick={() => { logout(); setOpen(false) }} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-left text-sm font-black text-white/88">Log out</button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setOpen(false)} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-black text-white/88">Log in</Link>
                  <Link href="/signup" onClick={() => setOpen(false)} className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#140d10]">Sign up</Link>
                </>
              )}
            </div>
          </div>
        ) : null}
      </header>
    </>
  )
}
