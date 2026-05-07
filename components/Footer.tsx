import {
  CircleHelp,
  Copyright,
  FileText,
  Mail,
  Scale,
  School,
  Shield,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-black/5 bg-white/50 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-6 py-12 sm:px-10">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <h3 className="text-lg font-bold text-[#102013]">BinWatch</h3>
            <p className="text-sm text-[#4c616c]">
              Smart Waste Monitoring for Campuses
            </p>
          </div>

          {/* Support & Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-[#102013]">Support</h4>
            <ul className="space-y-2 text-sm text-[#4c616c]">
              <li>
                <a
                  href="mailto:support@binwatch.com"
                  className="inline-flex items-center transition-colors hover:text-[#176d25]"
                >
                  <Mail className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                  support@binwatch.com
                </a>
              </li>
              <li>
                <a
                  href="#faq"
                  className="inline-flex items-center transition-colors hover:text-[#176d25]"
                >
                  <CircleHelp className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                  Help & FAQ
                </a>
              </li>
              <li>
                <a
                  href="#feedback"
                  className="inline-flex items-center transition-colors hover:text-[#176d25]"
                >
                  <FileText className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                  Send Feedback
                </a>
              </li>
            </ul>
          </div>

          {/* Institutional Info */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-[#102013]">About</h4>
            <ul className="space-y-2 text-sm text-[#4c616c]">
              <li>Developed by: 4PAX Team</li>
              <li className="inline-flex items-center">
                <School className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                Partner Institution: USTP
              </li>
              <li className="inline-flex items-center">
                <Copyright className="mr-2 h-3.5 w-3.5" aria-hidden="true" />©
                2026 BinWatch
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="flex flex-col gap-3">
            <h4 className="font-semibold text-[#102013]">Legal</h4>
            <ul className="space-y-2 text-sm text-[#4c616c]">
              <li>
                <a
                  href="#privacy"
                  className="inline-flex items-center transition-colors hover:text-[#176d25]"
                >
                  <Shield className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#terms"
                  className="inline-flex items-center transition-colors hover:text-[#176d25]"
                >
                  <Scale className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
                  Terms of Use
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-black/5 pt-6 text-center text-xs text-[#4c616c]">
          <p>BinWatch © 2026. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
