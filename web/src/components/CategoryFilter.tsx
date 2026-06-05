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
              : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
