'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Share2, UserPlus } from 'lucide-react'

export function ProfileHeaderActions() {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const currentUrl = window.location.href
    try {
      await navigator.clipboard.writeText(currentUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    } catch {
      const helper = document.createElement('textarea')
      helper.value = currentUrl
      helper.setAttribute('readonly', 'true')
      helper.style.position = 'absolute'
      helper.style.left = '-9999px'
      document.body.appendChild(helper)
      helper.select()
      document.execCommand('copy')
      document.body.removeChild(helper)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1600)
    }
  }

  return (
    <div className="flex flex-wrap gap-3 lg:justify-end">
      <button
        type="button"
        onClick={handleShare}
        className="inline-flex items-center gap-2 rounded-[1.2rem] border border-black/10 bg-[#f7f5ed] px-5 py-3 text-sm font-black text-black transition hover:border-[#819A91] hover:bg-white"
      >
        <Share2 className="h-4 w-4" />
        {copied ? 'Copied' : 'Share'}
      </button>
      <Link
        href="/login"
        className="inline-flex items-center gap-2 rounded-[1.2rem] bg-[#111111] px-5 py-3 text-sm font-black text-white transition hover:bg-[#1d1d1d]"
      >
        <UserPlus className="h-4 w-4" />
        Follow
      </Link>
    </div>
  )
}
