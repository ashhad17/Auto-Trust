
import React from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AuthModal from "@/components/auth/AuthModal";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-24 pb-16">
        <div className="container mx-auto px-4">
          {/* Hero section */}
          <div className="mb-16 text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-gradient">WheelsTrust</span>
            </h1>
            <p className="text-lg text-gray-600">
              We're on a mission to bring transparency and trust to the automotive industry.
              Our platform connects vehicle owners with reliable buyers and trusted service providers.
            </p>
          </div>

          {/* Our Story */}
          <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h2 className="text-3xl font-bold mb-4">Our Story</h2>
              <p className="text-gray-600 mb-4">
                WheelsTrust was founded in 2023 by a team of automotive enthusiasts who were frustrated by the lack of transparency in car buying, selling, and servicing.
              </p>
              <p className="text-gray-600 mb-4">
                After experiencing numerous challenges with hidden fees, misleading listings, and unpredictable service costs, we decided to create a platform that puts honesty and transparency first.
              </p>
              <p className="text-gray-600">
                Today, WheelsTrust is helping thousands of vehicle owners make informed decisions about their cars with confidence and peace of mind.
              </p>
            </div>
            <div className="order-first md:order-last">
              <img
                src="https://images.unsplash.com/photo-1552960394-c81add8de6b8?q=80&w=2070&auto=format&fit=crop"
                alt="Team working together"
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>

          {/* Our Values */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">Our Values</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Transparency</h3>
                <p className="text-gray-600">
                  We believe in complete honesty in pricing, vehicle history, and service quality.
                  No hidden fees, no surprises.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Trust</h3>
                <p className="text-gray-600">
                  We build trust through verification, reviews, and a community of honest 
                  users committed to fair dealings.
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <svg className="h-6 w-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Innovation</h3>
                <p className="text-gray-600">
                  We're constantly improving our platform to make car ownership easier,
                  more affordable, and more enjoyable.
                </p>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">1</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Create an Account</h3>
                <p className="text-gray-600">
                  Sign up for free and complete your profile to start buying,
                  selling, or booking services.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">2</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Browse Listings</h3>
                <p className="text-gray-600">
                  Search for vehicles or services that match your needs with
                  our powerful filters.
                </p>
              </div>
              <div className="text-center">
                <div className="bg-primary text-white rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                  <span className="font-bold">3</span>
                </div>
                <h3 className="text-xl font-semibold mb-2">Connect & Transact</h3>
                <p className="text-gray-600">
                  Connect with sellers or service providers and complete your
                  transaction with confidence.
                </p>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 md:p-12 text-white">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl font-bold mb-4">
                Ready to transform your car experience?
              </h2>
              <p className="text-blue-100 mb-8">
                Join thousands of satisfied users who have found a better way to buy, sell, and service their vehicles.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link to="/cars">
                  <Button className="bg-white text-primary hover:bg-gray-100">
                    Browse Vehicles
                  </Button>
                </Link>
                <Link to="/services">
                  <Button className="bg-white text-primary hover:bg-gray-100">
                    Find Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      <AuthModal />
    </div>
  );
};

export default About;
