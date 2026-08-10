import Link from "next/link";
import {
  // Facebook,
  // Instagram,
  Mail,
  MapPin,
  Phone,
  // Twitter,
} from "lucide-react";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#2b1b12] text-gray-300   ">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-3 gap-10">
        {/* Brand */}
        <div>
          <h2 className="text-3xl font-serif font-bold text-white">Anaaj</h2>

          <p className="mt-4 text-sm leading-6 text-gray-400">
            Fresh groceries sourced directly from trusted Indian farms and
            delivered to your doorstep.
          </p>
        </div>

        {/* Links */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>

          <div className="space-y-2 text-sm">
            <Link href="#" className="block hover:text-white">
              Home
            </Link>

            <Link href="#" className="block hover:text-white">
              Shop
            </Link>

            <Link href="#" className="block hover:text-white">
              About
            </Link>

            <Link href="#" className="block hover:text-white">
              Contact
            </Link>
          </div>
        </div>

        {/* Contact */}
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Contact</h3>

          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <MapPin size={18} />
              <span>New Delhi, India</span>
            </div>

            <div className="flex items-center gap-3">
              <Phone size={18} />
              <span>+91 98765 43210</span>
            </div>

            <div className="flex items-center gap-3">
              <Mail size={18} />
              <span>support@anaaj.com</span>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            {/* <Link href="#">
              <Facebook className="hover:text-white" size={20} />
            </Link>

            <Link href="#">
              <Instagram className="hover:text-white" size={20} />
            </Link>

            <Link href="#">
              <Twitter className="hover:text-white" size={20} />
            </Link> */}
          </div>
        </div>
      </div>

      <div className="border-t border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <p>© {year} Anaaj. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="#" className="hover:text-white">
              Privacy Policy
            </Link>

            <Link href="#" className="hover:text-white">
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
