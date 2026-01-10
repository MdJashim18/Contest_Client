import React from "react";
import { FaFacebook, FaGithub, FaLinkedin, FaTrophy, FaUsers, FaAward, FaRegEnvelope } from "react-icons/fa";
import { MdSupportAgent, MdPrivacyTip } from "react-icons/md";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-gray-900 via-blue-900 to-indigo-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* Company Info */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
              <FaTrophy className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-2xl font-bold">ContestHub</h3>
          </div>
          <p className="text-blue-100 leading-relaxed">
            Empowering creators worldwide through fair competition and massive opportunities. 
            Showcase your talent, compete globally, and win life-changing prizes.
          </p>
          {/* <div className="mt-6 flex items-center gap-3 text-sm text-blue-200">
            <div className="flex items-center gap-1">
              <FaUsers className="text-green-400" />
              <span>50K+ Creators</span>
            </div>
            <div className="flex items-center gap-1">
              <FaAward className="text-yellow-400" />
              <span>$2M+ Prizes</span>
            </div>
          </div> */}
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-white/30 pb-2 flex items-center gap-2">
            {/* <span>🏆</span> */}
            Quick Links
          </h4>
          <ul className="space-y-3">
            <li>
              <Link className="hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group" to="/all-contests">
                <span className="w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Browse Contests
              </Link>
            </li>
            <li>
              <Link className="hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group" to="/dashboard">
                <span className="w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                My Dashboard
              </Link>
            </li>
            {/* <li>
              <Link className="hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group" to="/winners">
                <span className="w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Past Winners
              </Link>
            </li>
            <li>
              <Link className="hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group" to="/leaderboard">
                <span className="w-1 h-1 bg-yellow-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Leaderboard
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Company */}
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-white/30 pb-2 flex items-center gap-2">
            <MdSupportAgent />
            Company
          </h4>
          <ul className="space-y-3">
            <li>
              <Link className="hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group" to="/About">
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                About Us
              </Link>
            </li>
            <li>
              <Link className="hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group" to="/Contact">
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                Contact Support
              </Link>
            </li>
            <li>
              <Link className="hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group" to="/FAQ">
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                FAQ & Help Center
              </Link>
            </li>
            {/* <li>
              <Link className="hover:text-yellow-400 transition-colors duration-300 flex items-center gap-2 group" to="/privacy">
                <span className="w-1 h-1 bg-blue-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                <span className="flex items-center gap-1">
                  <MdPrivacyTip /> Privacy Policy
                </span>
              </Link>
            </li> */}
          </ul>
        </div>

        {/* Connect With Us */}
        <div>
          <h4 className="text-xl font-semibold mb-4 border-b border-white/30 pb-2 flex items-center gap-2">
            <FaRegEnvelope />
            Connect With Us
          </h4>
          <p className="text-blue-100 mb-6">
            Follow us for contest updates, tips, and community highlights
          </p>
          
          <div className="flex gap-4">
            <a 
              href="https://www.linkedin.com/in/mohammadjashimuddinrubel/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl hover:from-blue-700 hover:to-blue-900 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="LinkedIn"
            >
              <FaLinkedin className="w-6 h-6 text-white" />
            </a>
            <a 
              href="https://github.com/MdJashim18" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-gradient-to-r from-gray-700 to-gray-900 rounded-xl hover:from-gray-800 hover:to-black transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="GitHub"
            >
              <FaGithub className="w-6 h-6 text-white" />
            </a>
            <a 
              href="https://www.facebook.com/share/1BEhor8qZ6/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl hover:from-blue-600 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
              aria-label="Facebook"
            >
              <FaFacebook className="w-6 h-6 text-white" />
            </a>
          </div>

          {/* Newsletter Signup */}
          {/* <div className="mt-8">
            <p className="text-sm text-blue-200 mb-3">Subscribe to our newsletter</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="flex-1 px-4 py-2 text-gray-900 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              />
              <button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-gray-900 font-semibold px-4 py-2 rounded-r-lg transition-all duration-300">
                Subscribe
              </button>
            </div>
          </div> */}
        </div>

      </div>

      {/* Bottom Bar */}
      {/* <div className="mt-12 pt-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <p className="text-blue-100 text-sm">
                &copy; {new Date().getFullYear()} ContestHub. All rights reserved.
              </p>
              <p className="text-blue-200 text-xs mt-1">
                Empowering creativity through competition since 2020
              </p>
            </div>
            
            <div className="flex gap-6 text-sm text-blue-200">
              <Link to="/terms" className="hover:text-yellow-400 transition-colors duration-300">
                Terms of Service
              </Link>
              <Link to="/privacy" className="hover:text-yellow-400 transition-colors duration-300">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="hover:text-yellow-400 transition-colors duration-300">
                Cookie Policy
              </Link>
            </div>
          </div>

          
          <div className="flex flex-wrap justify-center md:justify-end items-center gap-6 mt-6 text-xs text-blue-300">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>SSL Secured</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Secure Payments</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div> */}
    </footer>
  );
};

export default Footer;