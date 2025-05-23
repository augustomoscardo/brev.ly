import { useNavigate, useParams } from '@tanstack/react-router'
import { useEffect } from 'react'
import brevlyIcon from '/assets/icon.svg'
import { api } from '../services/api'

export function Redirect() {
  const navigate = useNavigate()
  const params = useParams({ from: '/$url' })

  useEffect(() => {
    async function fetchOriginalUrl() {
      try {
        const response = await api.get(`/links/${params.url}`)
        console.log(response)

        const originalUrl = response.data?.originalUrl

        if (originalUrl) {
          window.location.href = originalUrl
        } else {
          navigate({ to: '/not-found' })
        }
      } catch (err: unknown) {
        console.log(err)

        navigate({ to: '/not-found' })
      }
    }

    fetchOriginalUrl()
  }, [])

  return (
    <div className="px-3 lg:px-48 py-8 h-full flex items-center justify-center">
      <div className="flex flex-col items-center gap-6 py-12 px-5 lg:py-16 lg:px-12 bg-gray-100 rounded-lg mx-auto w-full max-w-xl">
        <img src={brevlyIcon} alt="Imagem do ícone da Brev.ly" className="w-12 h-12" />
        <h1 className="text-gray-600 text-xl leading-xl font-bold">Redirecionando...</h1>
        <div className="flex flex-col gap-1">
          <p className="text-gray-500 text-md leading-md text-center whitespace-nowrap">
            O link será aberto automaticamente em alguns instantes.{' '}
          </p>
          <p className="text-gray-500 text-md leading-md text-center">
            Não foi redirecionado?{' '}
            <a className="text-blue-base underline hover:text-blue-dark " href={`${params.url}`}>
              Acesse aqui
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
