import { useQuery } from "@tanstack/react-query";
import logoImg from "/assets/Logo.svg"
import type { LinkObject } from "./@types/link";
import { CreateLinkForm } from "./components/create-link-form";
import { Links } from "./components/links";
import { api } from "./services/api";

export function App() {
  async function fetchLinks() {
    try {
      const response = await api.get<LinkObject[]>('/links')

      return response.data || []
    } catch (error) {
      console.log(error);
    }
  }
  
  const { data: links } = useQuery({ queryKey: ['links'], queryFn: fetchLinks })

  return (
    <div className="w-full flex flex-col gap-8">
      <header className="w-full">
        <img src={logoImg} alt="Imagem da logo do Brevly" />
      </header>

      <div className="flex items-start gap-5 w-full">
        <CreateLinkForm />

        <Links links={links ?? []} />
      </div>
    </div>
  )
}
