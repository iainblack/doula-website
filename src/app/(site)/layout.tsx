import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { client } from '@/lib/sanity/client'
import { navbarQuery, footerQuery } from '@/lib/sanity/queries'

export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  let navbarData = null
  let footerData = null

  // Gracefully handle missing Sanity configuration during initial setup
  try {
    ;[navbarData, footerData] = await Promise.all([
      client.fetch(navbarQuery),
      client.fetch(footerQuery),
    ])
  } catch {
    // Sanity not yet configured — renders without nav/footer data
  }

  return (
    <>
      <Navbar data={navbarData} />
      <main className="pt-24">{children}</main>
      <Footer data={footerData} />
    </>
  )
}
