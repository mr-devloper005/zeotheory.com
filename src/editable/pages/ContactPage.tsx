'use client'

import { Building2, FileText, Image as ImageIcon, Mail, MapPin, Phone, Sparkles, Bookmark } from 'lucide-react'
import { pagesContent } from '@/editable/content/pages.content'
import { getFactoryState } from '@/design/factory/get-factory-state'
import { getProductKind } from '@/design/factory/get-product-kind'
import { EditableContactLeadForm } from '@/editable/components/EditableContactLeadForm'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'

function getLanes(kind: ReturnType<typeof getProductKind>) {
  if (kind === 'directory') {
    return [
      { icon: Building2, title: 'Business onboarding', body: 'Add listings, refine details, and shape a stronger business presentation.' },
      { icon: Phone, title: 'Partnership support', body: 'Discuss campaigns, featured placements, and structured publishing needs.' },
      { icon: MapPin, title: 'Coverage requests', body: 'Expand categories, add focus areas, or request a cleaner discovery lane.' },
    ]
  }
  if (kind === 'editorial') {
    return [
      { icon: FileText, title: 'Editorial submissions', body: 'Pitch essays, visual features, or article-led ideas that match the publication tone.' },
      { icon: Mail, title: 'Newsletter partnerships', body: 'Coordinate issue sponsorships, collaborations, and editorial campaigns.' },
      { icon: Sparkles, title: 'Contributor support', body: 'Get help with formatting, structure, and publishing flow.' },
    ]
  }
  if (kind === 'visual') {
    return [
      { icon: ImageIcon, title: 'Creator collaborations', body: 'Talk through gallery launches, showcases, and visual features.' },
      { icon: Sparkles, title: 'Licensing and use', body: 'Reach out about visual usage, commercial requests, and collection support.' },
      { icon: Mail, title: 'Media kits', body: 'Request decks, profile placements, and support for visual campaigns.' },
    ]
  }
  return [
    { icon: Bookmark, title: 'Collection submissions', body: 'Suggest resources, boards, and collections worth featuring.' },
    { icon: Mail, title: 'Resource partnerships', body: 'Coordinate curation projects, references, and content shelves.' },
    { icon: Sparkles, title: 'Curator support', body: 'Need help organizing archives, boards, or cross-linked profile pages?' },
  ]
}

export default function ContactPage() {
  const { recipe } = getFactoryState()
  const productKind = getProductKind(recipe)
  const lanes = getLanes(productKind)

  return (
    <EditableSiteShell>
      <main className="mx-auto max-w-[1320px] px-4 py-14 sm:px-6 lg:px-8">
        <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
          <div className="rounded-[2.5rem] bg-[linear-gradient(135deg,#140d10_0%,#2d141f_60%,#4b1826_100%)] p-8 text-white shadow-[0_28px_90px_rgba(0,0,0,0.18)] lg:p-10">
            <p className="text-[11px] font-black uppercase tracking-[0.3em] text-[#A7C1A8]">{pagesContent.contact.eyebrow}</p>
            <h1 className="mt-4 font-serif text-5xl font-semibold tracking-[-0.05em]">{pagesContent.contact.title}</h1>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-white/74">{pagesContent.contact.description}</p>
            <div className="mt-8 grid gap-4">
              {lanes.map((lane) => (
                <div key={lane.title} className="rounded-[1.6rem] border border-white/10 bg-white/8 p-5 backdrop-blur">
                  <lane.icon className="h-5 w-5 text-[#D1D8BE]" />
                  <h2 className="mt-3 text-xl font-semibold">{lane.title}</h2>
                  <p className="mt-2 text-sm leading-7 text-white/72">{lane.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-[#00000010] bg-white p-7 shadow-[0_22px_70px_rgba(15,23,42,0.08)]">
            <h2 className="font-serif text-3xl font-semibold">{pagesContent.contact.formTitle}</h2>
            <EditableContactLeadForm />
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
