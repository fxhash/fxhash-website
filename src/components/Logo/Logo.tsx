import { ClientOnlyEmpty } from "../Utils/ClientOnly";
import { LogoGenerative, LogoGenerativeProps } from "./LogoGenerative";

/**
 * The Logo component acts as a container for the Generative Logo, as it will
 * prevent its server-side rendering
 */
export function Logo({ width, height, fontSize }: LogoGenerativeProps) {
  return (
    <ClientOnlyEmpty>
      <LogoGenerative
        width={width}
        height={height}
        fontSize={fontSize}
      />
    </ClientOnlyEmpty>
  )
}
