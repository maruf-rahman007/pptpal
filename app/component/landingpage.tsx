import { InfiniteMovingCardsDemo } from "./ui/movingcard/InfinitCardDemo";
import { Button } from "@/components/ui/button"
import { TextGenerateEffectDemo } from "./ui/textgenaration/Effect";
import { ThreeDCardDemo } from "./ui/3D Card/3D-Demo";
import { Footer } from "./ui/Foooter";


export default function LandingPage() {

  return (
    <div className="pt-20 bg-customColor2">
      <div className="flex flex-col pl-8 lg:flex-row justify-center text-6xl font-bold">
        <div className="text-customfontColor"><TextGenerateEffectDemo words="Share PPTs," /></div>
        <div className="text-neutral-800 ml-6 text-4xl lg:ml-2 lg:text-6xl"><TextGenerateEffectDemo words="Skip the Hassle" /></div>
      </div>
      <div className="flex flex-col items-center text-2xl lg:text-5xl pt-4 text-customfontColor2 font-bold">
        <TextGenerateEffectDemo words="No Login Required" />
      </div>
      <div className="flex flex-col items-center text-xl lg:text-2xl p-8 lg:p-4 text-neutral-700 font-semibold">
        <TextGenerateEffectDemo words="A student-friendly platform for sharing presentations with ease." />
      </div>
      <div className="flex flex-row justify-center pl-2 lg:pl-0 mr-6 lg:mr-0 pt-0 lg:pt-7 gap-4">
        <Button path="/usersignin" className="bg-customfontColor hover:bg-customColor2 text-neutral-800 text-2xl px-3 py-5 rounded-xl" variant="outline">Get Started</Button>
        <Button path="/roomsignin" className="text-xl lg:text-2xl px-6 py-5 hover:bg-slate-300 rounded-xl" variant="outline">Login To Room</Button>
      </div>
      <div className="flex flex-col items-center max-h-80 pt-10">
        <InfiniteMovingCardsDemo />
      </div>
      <div className="pt-4 bg-customColor">
        <div className="lg:flex flex-row justify-center rounded-3xl">
          <div>
            <Footer />
          </div>
          <div>
            <ThreeDCardDemo />
          </div>
        </div>
        <div className="flex flex-col items-center pb-10">
          <p className="text-sm text-black-400">
            &copy; 2024 PPTPAL. All Rights Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
