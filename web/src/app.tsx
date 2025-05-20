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
    <div className=" flex flex-col gap-8 px-3 lg:px-48 py-8">
      <header className=" flex items-center justify-center lg:justify-start">
        <img src={logoImg} alt="Imagem da logo do Brevly" />
      </header>

      <div className="flex flex-col lg:flex-row items-start gap-5">
        <CreateLinkForm />

        <Links links={links ??[]} />
      </div>
    </div>
  )
}
