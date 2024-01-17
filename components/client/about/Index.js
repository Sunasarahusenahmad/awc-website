import React, { useEffect, useState } from "react";
import Navbar from "@/layouts/Client/Navbar";
import HeroSection from "./HeroSection";
import About from "./About";
import VisionMision from "./VisionMision";
import Timeline from "./Timeline";
import Certificate from "./Certificate";
import Footer from "@/layouts/Client/Footer";
import axios from "axios";
import Head from "next/head";

const Index = () => {
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSEOData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/about/router`
      );
      setLoading(false);
      setSeoData(response.data[0]);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching data:", error);
    }
  };
  const fetchData = async () => {
    await getSEOData();
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      {loading ? (

        <div className="fixed top-12 right-0 h-screen w-screen z-50 flex justify-center items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <>
          <Head>
            <title>{seoData.about_title || "AWC India"}</title>
            <meta
              name="keywords"
              content={seoData.about_keyword || "About US, AWC India"}
            />
            <meta
              name="description"
              content={seoData.about_desc || "About US, AWC India"}
            />
            {seoData.about_canonical && (
              <link rel="canonical" href={seoData.about_canonical} />
            )}
          </Head>
          <Navbar />
          <HeroSection />
          <About />
          <VisionMision />
          <Timeline />
          <Certificate />
          <Footer />
        </>
      )}
    </>
  );
};

export default Index;
