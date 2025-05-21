import notFoundImg from '/assets/404.svg'

export function NotFound() {
  return (
    <div className="flex flex-col items-center gap-6 py-12 px-5 lg:py-16 lg:px-12 bg-gray-100 rounded-lg mx-auto w-full max-w-xl">
      <img src={notFoundImg} alt="" className="w-12 h-12" />
      <h1 className="text-gray-600 text-xl leading-xl font-bold">Link não encontrado</h1>
      <div className="flex flex-col gap-1">
        <p className="text-gray-500 text-md leading-md text-center">
          O link que você está tentando acessar não existe, foi removido ou é uma URL inválida.
          Saiba mais em{' '}
          <a className="text-blue-base underline hover:text-blue-dark " href="/">
            brev.ly
          </a>
          .
        </p>
      </div>
    </div>
  )
}
