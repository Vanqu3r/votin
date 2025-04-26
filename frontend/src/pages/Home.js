import React from "react";
import Navbar from "../components/home/Navbar";
import HeroSection from "../components/home/HeroSection";
import VotingSystemSection from "../components/home/VotingSystemSection";

export default function Home() {
  return (
    <div className="home">
      <Navbar />
      <HeroSection />
      <VotingSystemSection />
    </div>
  );
}
