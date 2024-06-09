import LandingPage from "./LandingPage";
import AboutPage from "./AboutPage";
import SignUpContactPage from "./SignUpContactPage.tsx";


const LandingPageApp = () => {
  return (
    <>
      <section className="min-h-screen w-full flex justify-center items-center">
        <LandingPage />
      </section>
      <section className="min-h-screen w-full flex justify-center items-center">
        <AboutPage />
      </section>
      <section className="min-h-screen w-full flex justify-center items-center">
        <SignUpContactPage />
      </section>
    </>
  );
}

export default LandingPageApp;
