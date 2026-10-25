import React from "react";
import Navbar from "../layout/Navbar";
import Hero from "../landing/Hero";
import Feature from "../landing/Features"
import Testimonials from "../landing/Testimonials";
import Footer from "../landing/Footer";

const LandingPage = () => {
    return (
        <div>
            <Navbar />
            <Hero />
            <Feature />
            <Testimonials />
            <Footer />
        </div>
    );
};

export default LandingPage;