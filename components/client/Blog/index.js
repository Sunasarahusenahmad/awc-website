import React, { useEffect, useState } from "react";
import Navbar from "@/layouts/Client/Navbar";
import HeroSection from "./HeroSection";
import Blog from "./Blog";
import Footer from "@/layouts/Client/Footer";
import axios from "axios";
import Head from "next/head";
import Watshapp from "@/layouts/Client/Watshapp";

const index = () => {
  const [seoData, setSeoData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getSEOData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/client/blog/router`
      );
      setLoading(false);
      setSeoData(response.data[0]);
      console.log(response.data[0]);
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
            <title>
              {seoData.blog_title || "AWC India - Roof Waterproofing Solutions"}
            </title>
            <meta
              name="keywords"
              content={seoData.blog_keyword || "Blogs, AWC Blogs, AWC India"}
            />
            <meta
              name="description"
              content={
                seoData.blog_desc ||
                "AWC is the best roof waterproofing, terrace waterproofing, and external wall waterproofing contractor in Mumbai"
              }
            />
            {seoData.blog_canonical ? (
              <link rel="canonical" href={seoData.blog_canonical} />
            ) : (
              <link rel="canonical" href="https://awcindia.in/" />
            )}
          </Head>
          <Navbar />
          <Watshapp />
          <HeroSection />
          <Blog />
          <Footer />
        </>
      )}
    </>
  );
};

export default index;
