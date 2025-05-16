import { Copy, DownloadSimple, Link, Trash } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import logoImg from "/assets/Logo.svg"
import type { LinkObject } from "./@types/link";
import { api } from "./services/api";



export function App() {
  const [links, setLinks] = useState<LinkObject[]>([])

  useEffect(() => {
    async function fetchLinks() {
    const response = await api.get<LinkObject[]>('/links')

    if (response.data) return setLinks(response.data)

    setLinks([])
  }

  fetchLinks()
  }, [])

  const appUrl = window.location.origin

  return (
    <div className="w-full flex flex-col gap-8">
      <header className="w-full">
        <img src={logoImg} alt="Imagem da logo do Brevly" />
      </header>

      <div className="flex gap-5 w-full">
        <div className="flex-1 p-8 bg-gray-100 flex flex-col gap-6 rounded-lg">
          <h2 className="text-gray-600 text-lg leading-xl font-bold">Novo link</h2>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="originalUrl" className="text-gray-500 text-xs leading-xs uppercase">Link Original</label>
              <input 
                type="text" 
                name="originalUrl" 
                id="originalUrl" 
                placeholder="www.exemplo.com.br" 
                className="border border-gray-300 rounded-lg p-4 placeholder:text-gray-400 text-gray-600 text-md leading-md"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="shortUrl" className="text-gray-500 text-xs leading-xs uppercase">Link Encurtado</label>
              <input
                type="text"
                name="shortUrl"
                id="shortUrl"
                placeholder="brev.ly/"
                className="border border-gray-300 rounded-lg p-4 placeholder:text-gray-400 text-gray-600 text-md leading-md"
              />
            </div>
          </div>

          <button type="button" className="bg-blue-base text-white text-md leading-md rounded-lg py-4 cursor-pointer hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed">
            Salvar link
          </button>
        </div>

        <div className="flex-2 flex flex-col gap-5 p-8 bg-gray-100 rounded-lg">
          <div className="flex justify-between items-center">
            <h2 className="text-lg leading-lg text-gray-600 font-bold">Meus links</h2>
            <button 
              type="button" 
              className={`flex items-center gap-1.5 text-sm leading-sm rounded ${links.length > 0 ? '' : 'disabled:text-gray-500 disabled:bg-transparent'}`}
              
            >
              <DownloadSimple size={16} />
              Baixar CSV
            </button>
          </div>
          { links.length > 0 ? (
            <div className="flex flex-col py-4 space-y-8">
              {links.map(link => (
                <div key={link.id} className="flex gap-5 items-center">
                  <div className="flex-1 flex flex-col gap-1">
                    <p className="w-fit text-md leading-md text-blue-base cursor-pointer font-semibold hover:text-blue-dark hover:underline">{`${appUrl}/${link.shortUrl}`}</p>
                    <p className="text-sm leading-sm text-gray-500">{link.originalUrl}</p>
                  </div>
                  <p className="text-xs leading-xs text-gray-500">{link.accessCount} acessos</p>
                  <div className="flex items-center gap-1">
                    <button type="button" className="p-2.5 text-gray-600 bg-gray-200 rounded-sm cursor-pointer">
                      <Copy size={16} />
                    </button>
                    <button type="button" className="p-2.5 text-gray-600 bg-gray-200 rounded-sm cursor-pointer">
                      <Trash size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-3 items-center justify-center h-full">
              <Link size={32} className="text-gray-400" />
              <p className="text-xs leading-xs text-gray-500 uppercase">Ainda não existem links cadastrados</p>
          </div>
          )}
        </div>
      </div>
    </div>
  )
}
