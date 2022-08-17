import { ReactNode } from "react";

// SSR Fix
import Prism from "prismjs";
if (Prism) {
  require("prismjs/components/prism-clike");
  require("prismjs/components/prism-javascript");
  require("prismjs/components/prism-css");
  require("prismjs/components/prism-c");
  require("prismjs/components/prism-glsl");
  require("prismjs/components/prism-markdown");
  require("prismjs/components/prism-json");
  require("prismjs/components/prism-java");
  require("prismjs/components/prism-cpp");
  require("prismjs/components/prism-r");
  require("prismjs/components/prism-julia");
  require("prismjs/components/prism-python");
  require("prismjs/components/prism-rust");
}

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
