import { Background } from "@/components/Background";
import { CursorGlow } from "@/components/CursorGlow";
import { CursorTrail } from "@/components/CursorTrail";
import { ShatterEffect } from "@/components/ShatterEffect";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Skills } from "@/components/Skills";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { BackToTop } from "@/components/BackToTop";

export default function Home() {
  return (
    <>
      {/* Effects that must stay visible while the page shatters */}
      <ScrollProgress />
      <CursorTrail />
      <ShatterEffect />

      {/* Everything inside #shatter-root can dim, shake, and reassemble */}
      <div id="shatter-root">
        <Background />
        <CursorGlow />
        <Navbar />
        <main>
          <Hero />
          <About />
          <Projects />
          <Skills />
          <Contact />
        </main>
        <Footer />
        <BackToTop />
      </div>
    </>
  );
}
