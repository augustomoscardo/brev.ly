import { zodResolver } from '@hookform/resolvers/zod'
import { Warning } from '@phosphor-icons/react'
import { useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { api } from '../services/api'

const CreateLinkFormSchema = z.object({
  originalUrl: z.string().min(1, 'Informe uma url válida.').url('URL inválida'),
  shortUrl: z.string().min(1, 'Inform uma url minúscula e sem espaço/caracter especial.'),
})

type createLinkFormData = z.infer<typeof CreateLinkFormSchema>

export function CreateLinkForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CreateLinkFormSchema),
    defaultValues: {
      originalUrl: '',
      shortUrl: '',
    },
  })

  const queryClient = useQueryClient()

  async function createLink({ originalUrl, shortUrl }: createLinkFormData) {
    try {
      await api.post('/links', {
        originalUrl,
        shortUrl,
      })

      reset()
      queryClient.invalidateQueries({ queryKey: ['links'] })
    } catch (error) {
      console.log(error)

      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast.error('Erro no cadastro', {
            description: 'Essa url encurtada já existe.',
          })
        }

        return toast.error('Erro no cadastro.', {
          description: 'Ocorreu um ao cadastrar url encurtada.',
        })
      }

      return toast.error('Erro ao criar o link.', {
        description: 'Ocorreu um erro inesperado.',
      })
    }
  }

  return (
    <div className="flex-1 w-full p-6 lg:p-8 bg-gray-100 flex flex-col gap-6 rounded-lg">
      <h2 className="text-gray-600 text-lg leading-xl font-bold">Novo link</h2>

      <form onSubmit={handleSubmit(createLink)} className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="originalUrl"
            className="text-gray-500 text-xs leading-xs uppercase peer-focus:text-blue-base"
          >
            Link Original
          </label>
          <input
            type="text"
            id="originalUrl"
            placeholder="www.exemplo.com.br"
            {...register('originalUrl')}
            className={`peer border border-gray-300 rounded-lg p-4 placeholder:text-gray-400 text-gray-600 text-md leading-md focus:border-blue-base focus-visible:outline-none ${errors.originalUrl?.message ? 'border-danger' : ''}`}
          />
          {errors.originalUrl && (
            <div className="flex items-center gap-2">
              <Warning size={16} className="text-danger" />
              <p className="text-gray-500 text-sm leading-sm">{errors.originalUrl.message}</p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="shortUrl" className="text-gray-500 text-xs leading-xs uppercase">
            Link Encurtado
          </label>
          <div className="flex w-full items-center border border-gray-300 rounded-lg p-4 text-gray-400">
            <label htmlFor="shortUrl" className="inline-block pointer-none text-md leading-md">
              brev.ly/
            </label>
            <input
              type="text"
              id="shortUrl"
              {...register('shortUrl')}
              className={`text-gray-600 text-md leading-md focus:border-blue-base focus-visible:outline-none ${errors.shortUrl?.message ? 'border-danger' : ''}`}
            />
          </div>
          {errors.shortUrl && (
            <div className="flex items-center gap-2">
              <Warning size={16} className="text-danger" />
              <p className="text-gray-500 text-sm leading-sm">{errors.shortUrl.message}</p>
            </div>
          )}
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-blue-base text-white text-md leading-md rounded-lg py-4 cursor-pointer hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Salvar link
        </button>
      </form>
    </div>
  )
}
