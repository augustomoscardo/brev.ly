import { Link } from '@phosphor-icons/react'

export function EmptyLinks() {
  return (
    <div>
      <div className="py-2.5">
        <div className="h-px bg-gray-200" />
      </div>
      <div className="flex flex-col gap-3 items-center justify-center pt-4 pb-6">
        <Link size={32} className="text-gray-400" />
        <p className="text-xs leading-xs text-gray-500 uppercase">
          Ainda não existem links cadastrados
        </p>
      </div>
    </div>
  )
}
