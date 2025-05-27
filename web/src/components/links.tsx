import { useQuery } from '@tanstack/react-query'
import type { LinkObject } from '../@types/link'
import { api } from '../services/api'
import { EmptyLinks } from './empty-links'
import { ExportLinksButton } from './export-links-button'
import { FetchingLinks } from './fetching-links'
import { LinkItem } from './link-item'

export function Links() {
  async function fetchLinks() {
    try {
      const response = await api.get<LinkObject[]>('/links')

      return response.data || []
    } catch (error) {
      console.log(error)
    }
  }

  const { data: links = [], isFetching } = useQuery({ queryKey: ['links'], queryFn: fetchLinks })

  return (
    <div className="flex-2 w-full flex flex-col gap-5 p-6 lg:p-8 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg leading-lg text-gray-600 font-bold">Meus links</h2>

        <ExportLinksButton links={links} />
      </div>

      {links.length === 0 && !isFetching && <EmptyLinks />}

      {isFetching && <FetchingLinks />}

      {links.length > 0 && (
        <div className="flex flex-col py-4 space-y-8 max-h-70 overflow-y-auto border-t border-gray-200">
          {links.map(link => (
            <div key={link.id} className="flex gap-4 lg:gap-5 items-center min-w-0 w-full">
              <LinkItem link={link} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
