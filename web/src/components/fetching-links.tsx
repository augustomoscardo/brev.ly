import { Spinner } from '@phosphor-icons/react'

export function FetchingLinks() {
  return (
    <div>
      <div className="py-2.5">
        <div className="h-px bg-gray-200" />
      </div>
      <div className="flex flex-col gap-3 items-center justify-center pt-4 pb-6">
        <Spinner size={32} className="animate-spin" />
        <p className="text-xs leading-xs text-gray-500 uppercase">Carregando...</p>
      </div>
    </div>
  )
}
