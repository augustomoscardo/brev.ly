import logoImg from '/assets/Logo.svg'

export function Header() {
  return (
    <header className="flex items-center justify-center lg:justify-start pt-8 lg:pt-20">
      <img src={logoImg} alt="Imagem da logo do Brevly" />
    </header>
  )
}
