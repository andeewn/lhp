import { ActorHomepage } from "@/components/actor-homepage";
import { siteContent } from "@/content/siteContent";

export default function Home() {
  return <ActorHomepage content={siteContent} />;
}
