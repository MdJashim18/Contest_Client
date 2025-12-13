import React from "react";
import Logo from "../../../Components/Logo/Logo";
import {
  FaFacebookF,
  FaTwitter,
  FaYoutube,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="max-w-7xl mx-auto px-6 py-14">
       
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">

         
          <div className="space-y-4">
            <Logo />
            <p className="text-sm opacity-80 leading-relaxed">
              ACME Industries Ltd. <br />
              Providing reliable tech solutions since 1992.
            </p>
          </div>

         
          <div>
            <h3 className="footer-title mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li><a className="link link-hover">Home</a></li>
              <li><a className="link link-hover">All Contests</a></li>
              <li><a className="link link-hover">Dashboard</a></li>
              <li><a className="link link-hover">Contact Us</a></li>
            </ul>
          </div>

          
          <div>
            <h3 className="footer-title mb-4">Connect With Us</h3>

           
            <div className="flex gap-4 mb-6">
              <a className="btn btn-circle btn-outline hover:scale-110 transition">
                <FaFacebookF />
              </a>
              <a className="btn btn-circle btn-outline hover:scale-110 transition">
                <FaTwitter />
              </a>
              <a className="btn btn-circle btn-outline hover:scale-110 transition">
                <FaYoutube />
              </a>
              <a className="btn btn-circle btn-outline hover:scale-110 transition">
                <FaLinkedinIn />
              </a>
            </div>

            
            <div className="form-control w-full max-w-xs">
              <label className="label text-sm">
                Subscribe to our newsletter
              </label>
              <div className="join">
                <input
                  type="email"
                  placeholder="Email address"
                  className="input input-bordered join-item w-full"
                />
                <button className="btn btn-primary join-item">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        
        <div className="divider my-10"></div>

       
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm opacity-70">
          <p>
            © {new Date().getFullYear()} ACME Industries Ltd. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a className="link link-hover">Privacy Policy</a>
            <a className="link link-hover">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
