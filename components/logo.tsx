import Link from "next/link";
export function Logo({ light = false }: { light?: boolean }) {
  return <Link className={`logo ${light ? "logo-light" : ""}`} href="/ar" aria-label="NUVEXA Properties home"><span>NUVEXA</span><small>PROPERTIES</small></Link>;
}
