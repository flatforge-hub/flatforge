import { useMemo, useState } from 'react'
import AppCard from '../components/AppCard'
import CategoryFilter from '../components/CategoryFilter'
import appsData from '../data/apps.json'
import type { App } from '../types'

const apps = appsData as App[]

export default function Home() {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(apps.flatMap((a) => a.categories))).sort()],
    [],
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return apps.filter((a) => {
      const matchesSearch =
        !q ||
        a.name.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.developer.toLowerCase().includes(q) ||
        a.id.toLowerCase().includes(q)
      const matchesCategory =
        selectedCategory === 'All' || a.categories.includes(selectedCategory)
      return matchesSearch && matchesCategory
    })
  }, [search, selectedCategory])

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-zinc-200 bg-gradient-to-b from-forge-100/40 to-white dark:border-zinc-800 dark:from-forge-950/30 dark:to-zinc-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-zinc-900 dark:text-zinc-100 mb-4 tracking-tight">
            Open source apps for the{' '}
            <span className="bg-gradient-to-r from-forge-600 to-violet-500 dark:from-forge-400 dark:to-violet-300 bg-clip-text text-transparent">
              Linux desktop
            </span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-zinc-600 dark:text-zinc-400 mb-2">
            Built with any tools you use.
          </p>
          <p className="max-w-2xl mx-auto text-base text-zinc-500 mb-10">
            Quality required, slop rejected.
          </p>

          {/* Search */}
          <div className="max-w-xl mx-auto relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" className="text-zinc-500">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </div>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search apps, developers, IDs…"
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white border border-zinc-300
                         text-zinc-900 placeholder-zinc-500 focus:outline-none
                         focus:ring-2 focus:ring-forge-500 focus:border-transparent
                         transition-colors
                         dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-100"
            />
          </div>
        </div>
      </section>

      {/* App listing */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Category filter */}
        <div className="mb-8">
          <CategoryFilter
            categories={categories}
            selected={selectedCategory}
            onChange={setSelectedCategory}
          />
        </div>

        {/* Results header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm text-zinc-500">
            {filtered.length === apps.length
              ? `${apps.length} applications`
              : `${filtered.length} of ${apps.length} applications`}
          </p>
          {(search || selectedCategory !== 'All') && (
            <button
              onClick={() => { setSearch(''); setSelectedCategory('All') }}
              className="text-sm text-forge-600 hover:text-forge-500 dark:text-forge-400 dark:hover:text-forge-300 transition-colors"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filtered.map((app) => (
              <AppCard key={app.id} app={app} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-zinc-500">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-4 opacity-40">
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <p className="text-lg font-medium text-zinc-600 dark:text-zinc-400">No apps found</p>
            <p className="text-sm mt-1">Try a different search or category</p>
          </div>
        )}
      </section>

      {/* CTA */}
      <section className="border-t border-zinc-200 bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 text-center">
          <h2 className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Have an app to share?</h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-6 max-w-lg mx-auto">
            We just need it open source, sandboxed, with an icon and a description.
          </p>
          <a href="/submit" className="btn-primary">
            Submit an app
          </a>
        </div>
      </section>
    </div>
  )
}
