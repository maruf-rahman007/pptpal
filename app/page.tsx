import Image from "next/image";
import Navbar from "./component/Navbar";

export default function Home() {
  return (
    <div className="gap-20">
      <Navbar/>
      <div>
        Landing
      </div> 
    </div>
  );
}
