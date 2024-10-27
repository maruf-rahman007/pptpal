import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="pl-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-black-400"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-black-400"
                >
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-black-400"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="tel:+919341817975"
                  className="text-black-400"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
          <div className="pl-10">
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-2">
              <li className="flex items-center">
                <Phone className="mr-2 h-4 w-4" />
                <Link
                  href="tel:+8801891814681"
                  className="text-black-400"
                >
                  +8801891814681
                </Link>
              </li>
              <li className="flex items-center">
                <Mail className="mr-2 h-4 w-4" />
                <Link
                  href="mailto:marufrahman.dev@gmail.com"
                  className="text-black-400"
                >
                  marufrahman.dev@gmail.com
                </Link>
              </li>
              <li className="flex items-start">
                <MapPin className="mr-2 h-10 w-10 mt-1" />
                <Link
                  href="#"
                  target="_blank"
                  className="text-black-400 text-sm"
                >
                  No. 10/7, Dhaka, Bangladesh
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

