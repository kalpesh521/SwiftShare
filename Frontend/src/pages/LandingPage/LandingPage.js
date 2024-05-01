import { React, useEffect, useState } from "react";
import Background from "../../components/Background/Background";
import Hero from "../../components/Hero/Hero";
 
export default function LandingPage() {
  const [heroCount, setHeroCount] = useState(2);
  let heroData = [
    { text1: "Send and Manage ", text2: "large files " },
    {
      text1: "Share high-definition images",
      text2: "without any loss in quality ",
    },
    { text1: "Secure file transfer", text2: " via email or shareable links  " },
  ];

  useEffect(() => {
    setInterval(() => {
      setHeroCount((count) => {
        return count === 2 ? 0 : count + 1;
      });
    }, 2000);
  }, []);
  
  return (
    <div>
      <Background heroCount={heroCount} />
       <Hero
        heroCount={heroCount}
        heroData={heroData[heroCount]}
        setHeroCount={setHeroCount}
      />
    </div>
  );
}
