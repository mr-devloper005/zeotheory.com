'use client'

import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { pagesContent } from '@/editable/content/pages.content'

const USERS_KEY = 'slot4:local-auth-users'
const SESSION_KEY = 'slot4:local-auth-session'

type LocalUser = {
  name: string
  email: string
  password: string
  createdAt: string
}

const readUsers = (): LocalUser[] => {
  if (typeof window === 'undefined') return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(USERS_KEY) || '[]')
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

const saveUsers = (users: LocalUser[]) => window.localStorage.setItem(USERS_KEY, JSON.stringify(users))

const saveSession = (user: Pick<LocalUser, 'name' | 'email'>) => {
  window.localStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email, loggedInAt: new Date().toISOString() }))
  window.dispatchEvent(new Event('slot4-auth-change'))
}

const inputClass = 'h-14 rounded-[1.35rem] border border-black/10 bg-[#f7f5ed] px-4 text-base font-semibold text-black outline-none transition placeholder:text-black/38 focus:border-[#819A91] focus:bg-white focus:shadow-[0_0_0_4px_rgba(167,193,168,0.18)]'
const primaryButtonClass = 'inline-flex h-14 items-center justify-center rounded-[1.35rem] bg-[#111111] px-6 text-sm font-black uppercase tracking-[0.18em] text-white shadow-[0_18px_40px_rgba(17,17,17,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1d1d1d] disabled:opacity-60'
const secondaryButtonClass = 'inline-flex h-14 items-center justify-center rounded-[1.35rem] border border-black/10 bg-white px-6 text-sm font-black uppercase tracking-[0.18em] text-black transition hover:-translate-y-0.5 hover:border-[#819A91] hover:bg-[#f7f5ed]'
const labelClass = 'text-[11px] font-black uppercase tracking-[0.24em] text-black/60'

export function EditableLocalLoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedEmail = email.trim().toLowerCase()
    const user = readUsers().find((item) => item.email.toLowerCase() === normalizedEmail)
    if (!user || user.password !== password) {
      setStatus('error')
      setMessage(pagesContent.auth.login.noAccount)
      return
    }
    saveSession(user)
    setStatus('success')
    setMessage(pagesContent.auth.login.success)
    window.setTimeout(() => router.push('/'), 500)
  }

  return (
    <form className="mt-7 grid gap-4" onSubmit={submit}>
      <label className="grid gap-2">
        <span className={labelClass}>Email address</span>
        <input className={inputClass} type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="grid gap-2">
        <span className={labelClass}>Password</span>
        <input className={inputClass} type="password" placeholder="Enter your password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {message ? <p className={`rounded-[1.25rem] px-4 py-3 text-sm font-bold ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{message}</p> : null}
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <button type="submit" className={primaryButtonClass}>{pagesContent.auth.login.submitLabel}</button>
        <button type="button" className={secondaryButtonClass} onClick={() => router.push('/signup')}>Create account</button>
      </div>
    </form>
  )
}

export function EditableLocalSignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const normalizedName = name.trim()
    const normalizedEmail = email.trim().toLowerCase()
    if (password.length < 4) {
      setStatus('error')
      setMessage(pagesContent.auth.signup.passwordShort)
      return
    }
    const users = readUsers()
    const nextUser: LocalUser = {
      name: normalizedName || normalizedEmail.split('@')[0] || 'Member',
      email: normalizedEmail,
      password,
      createdAt: new Date().toISOString(),
    }
    saveUsers([nextUser, ...users.filter((item) => item.email.toLowerCase() !== normalizedEmail)])
    saveSession(nextUser)
    setStatus('success')
    setMessage(pagesContent.auth.signup.success)
    window.setTimeout(() => router.push('/'), 500)
  }

  return (
    <form className="mt-7 grid gap-4" onSubmit={submit}>
      <label className="grid gap-2">
        <span className={labelClass}>Full name</span>
        <input className={inputClass} placeholder="Enter your name" value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className="grid gap-2">
        <span className={labelClass}>Email address</span>
        <input className={inputClass} type="email" placeholder="Enter your email" value={email} onChange={(event) => setEmail(event.target.value)} required />
      </label>
      <label className="grid gap-2">
        <span className={labelClass}>Password</span>
        <input className={inputClass} type="password" placeholder="Create a password" value={password} onChange={(event) => setPassword(event.target.value)} required />
      </label>
      {message ? <p className={`rounded-[1.25rem] px-4 py-3 text-sm font-bold ${status === 'success' ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-700'}`}>{message}</p> : null}
      <div className="mt-2 grid gap-3 sm:grid-cols-2">
        <button type="submit" className={primaryButtonClass}>{pagesContent.auth.signup.submitLabel}</button>
        <button type="button" className={secondaryButtonClass} onClick={() => router.push('/login')}>Member login</button>
      </div>
    </form>
  )
}

export function useEditableLocalAuthSession() {
  const [session, setSession] = useState<{ name: string; email: string } | null>(null)

  useEffect(() => {
    const load = () => {
      try {
        const parsed = JSON.parse(window.localStorage.getItem(SESSION_KEY) || 'null')
        setSession(parsed && typeof parsed.email === 'string' ? parsed : null)
      } catch {
        setSession(null)
      }
    }
    load()
    window.addEventListener('slot4-auth-change', load)
    window.addEventListener('storage', load)
    return () => {
      window.removeEventListener('slot4-auth-change', load)
      window.removeEventListener('storage', load)
    }
  }, [])

  const logout = () => {
    window.localStorage.removeItem(SESSION_KEY)
    window.dispatchEvent(new Event('slot4-auth-change'))
    setSession(null)
  }

  return { session, logout }
}
