import { Fragment, lazy } from "react";
import { CategorySection } from "./CategorySection";
import { CategoryGridSection } from "./CategoryGridSection";
import {Hero} from "./Hero";
import FAQ from "./FAQ";
import ReelsSection from "./ReelsSection";
const TopRated = lazy(() => import("./TopRated"));
const BestSelling = lazy(() => import("./BestSelling"));
const NewArrivals = lazy(() => import("./NewArrivals"));
const Testimonials = lazy(() => import("./Testimonials"));
const StatsBar = lazy(() => import("./StatsBar"));

const Home = () => {
  return (
    <Fragment>
      <Hero />
      <StatsBar/>
      <CategorySection />
      <ReelsSection/>
      <BestSelling/>
      <TopRated/>
      <CategoryGridSection />
      <NewArrivals />
      <Testimonials />
      <FAQ/>
    </Fragment>
  );
};

export default Home;
