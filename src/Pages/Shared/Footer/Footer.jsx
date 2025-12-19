import React from "react";
import Logo from "../../../Components/Logo/Logo";
import {FaFacebookF,FaLinkedinIn} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-base-200 text-base-content">
      <div className="max-w-7xl mx-auto px-6 py-0.5 pt-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 items-start">


          <div className="space-y-4">
            <div>
              <Logo></Logo>
            </div>
            <p className="text-md opacity-80 leading-relaxed space-y-1.5">
              ACME Industries Ltd. <br />
              Providing reliable tech solutions since 2010.
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
              <a href="https://www.facebook.com/share/1BEhor8qZ6/" className="btn btn-circle btn-outline hover:scale-110 transition">
                <FaFacebookF />
              </a>

              <a href="https://www.linkedin.com/in/mohammad-jashim-uddin-692167365?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app" className="btn btn-circle btn-outline hover:scale-110 transition">
                <FaLinkedinIn />
              </a>
            </div>
          </div>
        </div>


        <div className="divider my-5"></div>
        <div className="flex flex-col md:flex-row justify-center items-center  text-lg opacity-70">
          <p>
            Copyright © {new Date().getFullYear()} ContestHub
          </p>
        </div>
        <div className="divider my-5"></div>
      </div>
    </footer>
  );
};

export default Footer;
