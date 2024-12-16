import { WhyValkyrie } from "./sections/WhyValkyrie";
import { Features } from "./sections/Features";
import { Testimonials } from "./sections/Testimonials";
import { FinalCTA } from "./sections/FinalCTA";

export function MainContent() {
  return (
    <>
      <WhyValkyrie />
      <Features />
      <Testimonials />
      <FinalCTA />
    </>
  );
}