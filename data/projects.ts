// data/projects.ts
export interface ProjectSection {
  heading: string
  body: string
}

export interface Project {
  id: number
  slug: string
  name: string
  category: string
  tech: string[]
  image: string
  colors: string[]
  date: string
  url?: string
  images: string[]
  content: ProjectSection[]
}

export const PROJECTS: Project[] = [
  {
    id: 1,
    slug: "designathon-2",
    name: "Designathon 2.0",
    category: "Design & Development",
    tech: ["NextJs", "GSAP", "Typescript", "Figma"],
    image: "/projects/designathon-2-0.png",
    colors: ["bg-blue-500", "bg-red-500", "bg-green-500", "bg-yellow-400"], // final: blue
    date: "2026-03-02",
    url: "https://designathon.gdgcace.in",
    images: [
      "/projects/designathon-2-0.png","/projects/designathon-1.png","/projects/designathon-2.png"
    ],
    content: [
      { heading: "Description", body: "Designathon 2.0 is the landing page website for the event Designathon 2.0, hosted by GDGC ACE in March 2026." },
      { heading: "What I Built", body: "My vision being the web co-lead was to build something catchy, and not follow the other space themed websites with just black background gradients, starts and planets. I wanted to build something different, which feels like a story being unfold. I want to ensure that each scroll by user is worth their time." },
      { heading: "My Constraints", body: "Me and my team had the challenge of building this website within few weeks. Our workforce was limited as we had seniors who were unable to help due to their own work and a team of ambitious but inexperienced juniors. " },
       { heading: "My process", body: "I started by visualising, and searching for ideas online, trying to come up with a flow. After several iterations, I stuck with one flow. Then I set out to collect inspiration for how my sections would look like, and how fast we can design them. I decided the fonts, color scheme, asset-theme, how the website should look and feel. Then I made a .md design guide file for juniors and we started with the design part. After several days of designing, review, redesigning, we settled with our design and began with the coding phase. I lead the development team, where I explained them my vision, which they understood and did a fantastic job. My part here was to build the timeline section, few parts in Hero, reviewing and polishing of the entire website." },
    ],
  },
  {
    id: 2,
    slug: "component-playground",
    name: "Component Playground",
    category: "Experimenting Components",
    tech: ["Next.js", "GSAP", "WebGL", "ThreeJS"],
    image: "/projects/component-lib.png",
    colors: ["bg-red-500", "bg-green-500", "bg-blue-500", "bg-yellow-400"], // final: red
    date: "2026-02-10",
    url: "https://mannan88.github.io/component-lib/",
    images: [
      "/projects/component-lib.png",
      "/projects/component-lib-1.png",
      "/projects/component-lib-2.png",
    ],
    content: [
      { heading: "Description", body: "This is an experiment area where I try out different concepts, components, and methods and build a component out of it. This is like my online trail of components, reflecting my journey and learning. Currently its focused on concepts of GLSL shaders and ThreeJS." },
      { heading: "Future Scope", body: "I envision this to be full of interesting and beautiful components, where I'm not just learning, but actually creating stunning components." },
    ],
  },
  {
    id: 3,
    slug: "insurance-broker-os",
    name: "Insurance Broker OS",
    category: "Landing page Design & Dev",
    tech: ["NextJS", "Typescript", "GSAP", "ThreeJS", "Figma"],
    image: "/projects/insurance-broker-os.png",
    colors: ["bg-green-500", "bg-blue-500", "bg-red-500", "bg-yellow-400"], // final: green
    date: "2026-01-05",
    //url: "/",
    images: [
      "/projects/insurance-broker-os.png","/projects/insurance-broker-1.png","/projects/insurance-broker-2.png"
    ],
    content: [
      { heading: "Description", body: "Insurance Broker OS is a product of Gloryquick IT Solutions pvt ltd. My role here was to design and build the landing page of their product. It features description of the entire product, unique sections, following the branding and user experience." },
      { heading: "The Constraints", body: "My biggest constraint was time, as it is a landing page, I had to get this completed within few days. Hence I started by designing the basic web structure on Figma, asked about what pages were required, what information do we want to convey. Other constraint was branding. I had to follow their branding schema." },
      { heading: "My process", body: "I first started by hunting for other similar landing pages of other service platforms. I noticed one pattern, all those websites had similar design, classy, minimal, modern black websites with glass effect and/or graident effects. As I wanted to create something unique, I knew what I wanted to do. I then started creating the pages, leaving few section empty on purpose, as those were the sections which will require excessive imagination and thinking. Hence following the time constraint, I completed rest of the pages and sections, and then set took my time with hero and few other secitons, backgrounds, interaction and after several iterations and re-design based on feedback, I ended up with this web design. Since I had the vision, I wasted no time in making perfect copy, rather just focused on converting the design into actual page. I handled the development of this entire landing page, including responsiveness." },
    ],
  },

  {
    id: 4,
    slug: "alumnest",
    name: "Alumnest",
    category: "App Design",
    tech: ["Figma"],
    image: "/projects/alumnest.png",
    colors: ["bg-yellow-400", "bg-red-500", "bg-green-500", "bg-blue-500"], // final: yellow
    date: "2025-09-14",
    url: "https://www.figma.com/proto/bI1YnOlJIhsw8ECLucbxLQ/Alumnest?node-id=39-212&viewport=329%2C-317%2C0.38&t=V5hPjNXMPkvENuHE-1&scaling=scale-down&content-scaling=fixed&starting-point-node-id=5%3A92&show-proto-sidebar=1&page-id=0%3A1",
    images: [
      "/projects/alumnest.png"
    ],
    content: [
      { heading: "Description", body: "Alumnest is a Alumni netowrk app. This is a freelance project, where I re-designed their app, revamping their product and branding." },
      { heading: "My constraints", body: "My client wanted to launch their app by 01st of June 2026. Hence I had the time of merely few days to come up with the design idea. My client wanted the app to feel premium, following the theme of dark and yellow, minimal yet luxury. Now designing a luxury app isn't the difficult task, but designing a luxury social app was a challenge for me, since all other luxury apps revolve around some product or service. Especially adding the minimalism constraints, it was a challenge indeed." },
      { heading: "My Process", body: "I started hunting for luxury and minimalistic designs, studied on elements which actually made them luxury without over crowding the screen. Then I decidec to use the given color scheme of gold and dark, and used the inspiration of jewely showcases. The thing about jewely showcase is, they display jewelries on dark displays with next to nothing in the background, hence entire focus is on gleaming jewelry. I wanted to showcase that into the app, by using gold as my accent color and dark gray as the primary. I then based my design around how the user will use this app, what flow will be comfortable for the user, and kept the functions and buttons on point, with sophisticated button icons, and a smidge of gold to highlight something. After several iterations, re-designing around feedbacks, I was able to nail the design which followed all constraints and my clients actually loved it." },
    ],
  },
]

export function textColorFor(bgClass: string) {
  return bgClass.includes("yellow") ? "text-neutral-900" : "text-white"
}
