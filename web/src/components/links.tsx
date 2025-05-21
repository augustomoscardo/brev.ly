import { Copy, DownloadSimple, Link, Spinner, Trash } from '@phosphor-icons/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import type { LinkObject } from '../@types/link'
import { api } from '../services/api'

interface LinksProps {
  links: LinkObject[]
}

export function Links({ links }: LinksProps) {
  const queryClient = useQueryClient()
  const { data, isPending, mutate } = useMutation({
    mutationFn: exportLinks,
  })
  // console.log(data, isPending);

  const appUrl = window.location.origin

  async function handleDeleteLink(linkId: string) {
    try {
      await api.delete(`/links/${linkId}`)
      queryClient.invalidateQueries({ queryKey: ['links'] })
    } catch (error) {
      console.log(error)
    }
  }

  async function exportLinks() {
    try {
      const response = await api.post('/export-links')
      const { reportUrl } = response.data

      window.open(reportUrl)
      return reportUrl
    } catch (error) {
      console.log(error)
      if (error instanceof AxiosError) {
        return toast.error('Erro ao exportar links', {
          description: error.response?.data.message,
        })
      }
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
    <div className="flex-2 w-full flex flex-col gap-5 p-6 lg:p-8 bg-gray-100 rounded-lg">
      <div className="flex justify-between items-center">
        <h2 className="text-lg leading-lg text-gray-600 font-bold">Meus links</h2>
        <button
          type="button"
          disabled={!links.length || isPending}
          onClick={() => mutate()}
          className={`
            flex items-center gap-1.5 p-2 text-sm leading-sm rounded cursor-pointer text-gray-500 border border-transparent 
            ${links.length > 0 ? 'bg-gray-200 hover:border-blue-base' : 'disabled:bg-transparent disabled:cursor-not-allowed opacity-50'}
            ${isPending ? 'cursor-not-allowed' : ''}`}
        >
          {isPending ? (
            <>
              <Spinner size={16} className="animate-spin" />
              Baixando...
            </>
          ) : (
            <>
              <DownloadSimple size={16} />
              Baixar CSV
            </>
          )}
        </button>
      </div>
      {links.length > 0 ? (
        <div className="flex flex-col py-4 space-y-8 max-h-70 overflow-y-auto border-t border-gray-200">
          {links.map(link => (
            <div key={link.id} className="flex gap-4 lg:gap-5 items-center min-w-0 w-full">
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
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3 items-center justify-center min-h-60 border-t border-gray-200">
          <Link size={32} className="text-gray-400" />
          <p className="text-xs leading-xs text-gray-500 uppercase">
            Ainda não existem links cadastrados
          </p>
        </div>
      )}
    </div>
  )
}
