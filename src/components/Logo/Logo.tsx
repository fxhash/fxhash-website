import { ClientOnlyEmpty } from "../Utils/ClientOnly";
import { LogoGenerative } from "./LogoGenerative";

/**
 * The Logo component acts as a container for the Generative Logo, as it will
 * prevent its server-side rendering
 */
export function Logo() {
  return (
    <ClientOnlyEmpty>
      <LogoGenerative/>
    </ClientOnlyEmpty>
  )
}