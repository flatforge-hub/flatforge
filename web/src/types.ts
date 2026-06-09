export interface App {
  id: string
  name: string
  summary: string
  description: string
  developer: string
  website: string
  source: string
  license: string
  icon: string
  screenshots: string[]
  categories: string[]
  ai_tools_used?: string
  status?: string
  version?: string
  release_date?: string
}
