import bts from "@/data/behind-the-scenes.json"
import BlogPost from "@/component/BlogPost"

export default function BehindTheScenesPage() {
  return <BlogPost {...bts} />
}
