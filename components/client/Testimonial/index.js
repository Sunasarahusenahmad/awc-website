import React, { useEffect, useState } from 'react';
import Navbar from '@/layouts/Client/Navbar';
import HeroSection from './HeroSection';
import TestiContact from './TestiContact';
import Footer from '@/layouts/Client/Footer';
import axios from "axios";
import Head from "next/head";

const index = () => {
    const [seoData, setSeoData] = useState([]);
    const [loading, setLoading] = useState(true);

    const getSEOData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/client/testimonials/router`
        );
        setLoading(false);
        setSeoData(response.data[0]);
        console.log(response.data[0]);
      } catch (error) {
        setLoading(false);
        console.error("Error fetching data:", error);
      }
    };
  
    useEffect(() => {
      const fetchData = async () => {
        await getSEOData();
      };
      fetchData();
    }, []);
    return (
        <>
        {loading ? (
          <h1>Loading</h1>
        ) : (
          <>
            <Head>
              <title>{seoData.testimonial_title || "gallery"}</title>
              <meta
                name="keywords"
                content={
                  seoData.testimonial_keyword || "gallery, AWC gallery, AWC India"
                }
              />
              <meta
                name="description"
                content={
                  seoData.testimonial_desc || "gallery, AWC gallery, AWC India"
                }
              />
              {seoData.testimonial_canonical && (
                <link rel="canonical" href={seoData.testimonial_canonical} />
              )}
            </Head>
            <Navbar />
            <HeroSection />
            <TestiContact />
            <Footer />
          </>
        )}
      </>
    )
}

export default index
