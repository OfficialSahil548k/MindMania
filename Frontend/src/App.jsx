import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import FeaturedSection from "./components/FeaturedSection";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <Hero />
                  <FeaturedSection />
                </>
              }
            />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
