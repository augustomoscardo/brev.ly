import { DownloadSimple, Spinner } from '@phosphor-icons/react'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { toast } from 'sonner'
import type { LinkObject } from '../@types/link'
import { api } from '../services/api'

interface ExportLinksButtonProps {
  links: LinkObject[]
}

export function ExportLinksButton({ links }: ExportLinksButtonProps) {
  const { data, isPending, mutate } = useMutation({
    mutationFn: exportLinks,
  })

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

  return (
    <button
      type="button"
      disabled={!links.length || isPending}
      onClick={() => mutate()}
      className={`
      flex items-center gap-1.5 p-2 text-sm leading-sm rounded cursor-pointer text-gray-500 border border-transparent bg-gray-200 hover:border-blue-base disabled:cursor-not-allowed disabled:bg-transparent disabled:opacity-50 disabled:hover:border-transparent`}
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
  )
}
