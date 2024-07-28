import { useEffect } from "react";
import LandingPage from "./LandingPage";
import AboutPage from "./AboutPage";
import SignUpContactPage from "./SignUpContactPage.tsx";


const LandingPageApp = () => {
  /** Set Page Title To "Trek" */
  useEffect(() => {
    document.title = "Trek";
  }, []);
  
  return (
      <>
          <section className="h-full w-full flex justify-center items-center">
              <LandingPage/>
          </section>
          <section className="h-full w-full flex justify-center items-center sm: full-size">
              <AboutPage/>
          </section>
          <section className="min-h-screen w-screen flex justify-center items-center">
              <SignUpContactPage/>
          </section>
      </>
  );
}

export default LandingPageApp;
