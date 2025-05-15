import { Copy, Link } from "@phosphor-icons/react";
import logoImg from "../public/assets/Logo.svg"

export function App() {
  
  return (
    <div className="w-full flex flex-col gap-8">
      <header className="w-100">
        <img src={logoImg} alt="Imagem da logo do Brevly" />
      </header>

      <div className="flex gap-5">
        <div className="p-8 bg-gray-100 flex flex-col gap-6">
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

          <button type="button">
            Salvar link
          </button>
        </div>

        <div className="p-8 bg-gray-100">
          <div>
            <h2>Meus links</h2>
            <button type="button">
              <Copy size={24} />
              Baixar CSV
            </button>
          </div>
          <div>
            <Link />
            Ainda não existem links cadastrados
          </div>
        </div>
      </div>
    </div>
  )
}
