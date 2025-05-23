import { useQuery } from '@tanstack/react-query'
import type { LinkObject } from '../@types/link'
import { CreateLinkForm } from '../components/create-link-form'
import { Header } from '../components/header'
import { Links } from '../components/links'
import { api } from '../services/api'

export function Home() {
  async function fetchLinks() {
    try {
      const response = await api.get<LinkObject[]>('/links')

      return response.data || []
    } catch (error) {
      console.log(error)
    }
  }

  const { data: links } = useQuery({ queryKey: ['links'], queryFn: fetchLinks })

  return (
    <div className=" flex flex-col gap-8 px-3 lg:px-48 py-8">
      <Header />

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <CreateLinkForm />

        <Links links={links ?? []} />
      </div>
    </div>
  )
}
