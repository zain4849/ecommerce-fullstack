import Image from "next/image";
import React from "react";
import { FaTwitter, FaInstagram, FaYoutube, FaHeadset } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { CiMail } from "react-icons/ci";


const Footer = () => {
  return (
    <footer className="w-full h-125 bg-foreground text-background">
      <div className="container mx-auto w-full h-125  bg-foreground">
        <div className=" py-12 w-full justify-evenly border-b h-25 bg-foreground mt-5 flex">
          <div className="flex  items-center gap-7">
            <FaLocationDot color="white" size={25}/>
            <div className="flex flex-col">
              <h2 className="font-bold">Store Locator</h2>
              <p>Find a store nearby</p>
            </div>
          </div>
          <div className="flex items-center gap-7">
            <FaHeadset color="white" size={25}/>
            <div className="flex flex-col">
              <h2 className="font-bold">Online Support</h2>
              <p>Available 24/7</p>
            </div>
          </div>
          <div className="flex items-center gap-7">
            <CiMail color="white" size={25}/>
            <div className="flex flex-col">
              <h2 className="font-bold">Email us</h2>
              <p>0000@email.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <FaInstagram color="white" size={25}/>
            <FaTwitter color="white" size={25}/>
            <FaYoutube color="white" size={25}/>
          </div>
        </div>
        <div className="w-full h-60 my-8 flex  justify-around">
          <div>
            <h2 className="font-bold mb-3">Products</h2>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#">Smartphones</a></li>
              <li><a href="#">Laptops</a></li>
              <li><a href="#">Smart</a> Home</li>
              <li><a href="#">Audio</a></li>
              <li><a href="#">Accessories</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold mb-3">Help</h2>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#">Service</a> & Repairs</li>
              <li><a href="#">Warranty</a> Info</li>
              <li><a href="#">Delivery</a> Options</li>
              <li><a href="#">Troubleshooting</a></li>
              <li><a href="#">Support</a> Center</li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold mb-3">Privacy</h2>
            <ul className="flex flex-col gap-4 text-sm">
              <li><a href="#">Privacy</a></li>
              <li><a href="#">Terms</a></li>
              <li><a href="#">Returns</a></li>
              <li><a href="#">Warranty</a></li>
            </ul>
          </div>
          <div>
            <h2 className="font-bold mb-3">Payment Method</h2>
            <ul className="flex gap-8">
              <li><Image src="/visa.svg" width={40} height={20} alt="Visa" style={{ filter: "invert(1)" }} />
</li>
              <li>  <Image src="/mastercard.svg" width={40} height={20} alt="Mastercard" style={{ filter: "invert(1)" }} />
</li>
              <li>  <Image src="/paypal.svg" width={35} height={10} alt="PayPal" style={{ filter: "invert(1)" }} />
</li>
              <li>  <Image src="/apple-pay.svg" width={40} height={20} alt="Apple Pay" style={{ filter: "invert(1)" }} />
</li>
              <li></li>
            </ul>
          </div>
        </div>
        <div className=" w-full h-20 border-t text-white flex items-center gap-4">
          <h1 className="font-bold text-[1.5rem]">ZELECT</h1>
          <p>© 2025 MotionCore. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
