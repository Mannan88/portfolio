// data/projects.ts
export interface Project {
  id: number
  name: string
  category: string
  tech: string[]
  image: string
  // index 0 = topmost layer = the row's final settled color.
  // remaining indices stack underneath it and fill in first.
  colors: string[]
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    name: "Component Playground",
    category: "Experimenting Components",
    tech: ["Next.js", "GSAP", "WebGL", "ThreeJS"],
    image: "https://picsum.photos/seed/solace/600/800",
    colors: ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-400"], // final: red
  },
  {
    id: 2,
    name: "Insurance Broker OS",
    category: "Landing page Design & Dev",
    tech: ["NextJS","Typescript","GSAP","ThreeJS", "Figma"],
    image: "https://picsum.photos/seed/nimbus/600/800",
    colors: ["bg-green-500", "bg-blue-500", "bg-red-500", "bg-yellow-400"], // final: green
  },
  {
    id: 3,
    name: "Designathon 2.0",
    category: "Design & Development",
    tech: ["NextJs", "GSAP", "Typescript", "Figma"],
    image: "https://picsum.photos/seed/fathom/600/800",
    colors: ["bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-400"], // final: blue
  },
  {
    id: 4,
    name: "Alumnest",
    category: "App Design",
    tech: ["Figma"],
    image: "https://picsum.photos/seed/ember/600/800",
    colors: ["bg-yellow-400", "bg-red-500", "bg-green-500", "bg-blue-500"], // final: yellow
  },
]

export function textColorFor(bgClass: string) {
  return bgClass.includes("yellow") ? "text-neutral-900" : "text-white"
}
