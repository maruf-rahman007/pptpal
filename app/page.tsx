import Image from "next/image";
import Navbar from "./component/Navbar";
import LandingPage from "./component/landingpage";

export default function Home() {
  return (
    <div className="gap-20">
      <Navbar />
      <LandingPage/>
    </div>
  );
}
