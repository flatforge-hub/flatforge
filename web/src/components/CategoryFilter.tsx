interface Props {
  categories: string[]
  selected: string
  onChange: (cat: string) => void
}

export default function CategoryFilter({ categories, selected, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onChange(cat)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
            selected === cat
              ? 'bg-forge-600 border-forge-500 text-white'
              : 'bg-zinc-100 border-zinc-200 text-zinc-600 hover:border-zinc-400 hover:text-zinc-900 dark:bg-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
