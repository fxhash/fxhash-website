import { ReactNode } from "react";
import "prismjs/components/prism-clike"
import "prismjs/components/prism-javascript"
import "prismjs/components/prism-css"
import "prismjs/components/prism-c"
import "prismjs/components/prism-glsl"
import "prismjs/components/prism-markdown"
import "prismjs/components/prism-json"
import "prismjs/components/prism-java"
import "prismjs/components/prism-cpp"
import "prismjs/components/prism-r"
import "prismjs/components/prism-julia"
import "prismjs/components/prism-python"
import "prismjs/components/prism-rust"

export interface ILanguageEntry {
  name: string
  value: string
  icon: ReactNode
}
export const codeEditorLangs: ILanguageEntry[] = [
  {
    name: "Plain",
    value: "plain",
    icon: <i className="fa-regular fa-text" aria-hidden />
  },
  {
    name: "Javascript",
    value: "js",
    icon: <i className="fa-brands fa-square-js" aria-hidden />
  },
  {
    name: "GLSL",
    value: "glsl",
    icon: <i className="fa-regular fa-file-code" aria-hidden />
  },
  {
    name: "HTML",
    value: "html",
    icon: <i className="fa-brands fa-html5" aria-hidden />
  },
  {
    name: "CSS",
    value: "css",
    icon: <i className="fa-brands fa-css3-alt" aria-hidden />
  },
  {
    name: "JSON",
    value: "json",
    icon: <i className="fa-solid fa-brackets-curly" aria-hidden />
  },
  {
    name: "Java",
    value: "java",
    icon: <i className="fa-brands fa-java" aria-hidden />
  },
  {
    name: "C",
    value: "c",
    icon: <i className="fa-regular fa-file-code" aria-hidden />
  },
  {
    name: "C++",
    value: "cpp",
    icon: <i className="fa-regular fa-file-code" aria-hidden />
  },
  {
    name: "R",
    value: "r",
    icon: <i className="fa-brands fa-r-project" aria-hidden />
  },
  {
    name: "Rust",
    value: "rust",
    icon: <i className="fa-brands fa-rust" aria-hidden />
  },
  {
    name: "Python",
    value: "py",
    icon: <i className="fa-brands fa-python" aria-hidden />
  },
  {
    name: "Julia",
    value: "julia",
    icon: <i className="fa-regular fa-file-code" aria-hidden />
  },
]

export function getCodeEditorLang(value: string|null): ILanguageEntry {
  return codeEditorLangs.find(entry => entry.value === value) || codeEditorLangs[0]
}
