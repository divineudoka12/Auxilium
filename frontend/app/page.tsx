import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import FeatureCards from "@/components/landing/FeatureCards";
import ImpactStats from "@/components/landing/ImpactStats";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-ink">
      <Nav />
      <Hero />
      <FeatureCards />
      <ImpactStats />
      <Footer />
    </main>
  );
}
