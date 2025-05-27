import { CreateLinkForm } from '../components/create-link-form'
import { Header } from '../components/header'
import { Links } from '../components/links'

export function Home() {
  return (
    <div className=" flex flex-col gap-8 px-3 lg:px-48 py-8">
      <Header />

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        <CreateLinkForm />

        <Links />
      </div>
    </div>
  )
}
