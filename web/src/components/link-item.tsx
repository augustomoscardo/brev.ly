import { Copy, Trash } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import type { LinkObject } from '../@types/link'
import { api } from '../services/api'

interface LinkItemProps {
  link: LinkObject
}

export function LinkItem({ link }: LinkItemProps) {
  const appUrl = window.location.origin

  const queryClient = useQueryClient()

  async function handleDeleteLink(linkId: string) {
    try {
      await api.delete(`/links/${linkId}`)
      queryClient.invalidateQueries({ queryKey: ['links'] })
    } catch (error) {
      console.log(error)
    }
  }

  async function copyToClipboard(url: string) {
    try {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado para a área de transferência!')
    } catch {
      toast.error('Não foi possível copiar o link.')
    }
  }

  return (
    <>
      <div className="flex-1 flex flex-col gap-1 min-w-0">
        <a
          href={`${appUrl}/${link.shortUrl}`}
          className="text-md leading-md text-blue-base cursor-pointer font-semibold truncate block hover:text-blue-dark hover:underline"
        >
          {`${appUrl}/${link.shortUrl}`}
        </a>
        <p className="text-sm leading-sm text-gray-500 truncate">{link.originalUrl}</p>
      </div>
      <p className="text-xs leading-xs text-gray-500 flex-none whitespace-nowrap">
        {link.accessCount} acessos
      </p>
      <div className="flex items-center gap-1 flex-none">
        <button
          type="button"
          onClick={() => copyToClipboard(`${appUrl}/${link.shortUrl}`)}
          className="p-2.5 text-gray-600 bg-gray-200 rounded-sm cursor-pointer border border-transparent hover:border-blue-base"
        >
          <Copy size={16} />
        </button>
        <button
          type="button"
          onClick={() => handleDeleteLink(link.id)}
          className="p-2.5 text-gray-600 bg-gray-200 rounded-sm cursor-pointer border border-transparent hover:border-blue-base"
        >
          <Trash size={16} />
        </button>
      </div>
    </>
  )
}
