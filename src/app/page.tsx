
import Footer from "@/components/Footer"
import HeroSection from "@/components/hero-section"
import CategorySection from "@/components/category-section"
import FeaturedProducts from "@/components/featured-products"
import NewsletterSection from "@/components/newsletter-section"

export default function HomePage() {
  return (
    <div className="min-h-screen">
     
      <main>
        <HeroSection />
        <CategorySection />
        <FeaturedProducts />
        <NewsletterSection />
      </main>
      <Footer />
    </div>
  )

}
