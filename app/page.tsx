import { HomePage } from "@/components/home-page";
import { getProjects, getProperties } from "@/lib/api";

export default async function Page() {
  const [properties,projects]=await Promise.all([getProperties("ar"),getProjects("ar")]);
  return <HomePage locale="ar" properties={properties} projects={projects}/>;
}
