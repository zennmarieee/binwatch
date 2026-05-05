"use client";

import { useEffect, useMemo, useState } from "react";

type HeaderLink = {
  label: string;
  href: string;
  isActive?: boolean;
};

type PublicHeaderProps = {
  brand: string;
  links: readonly HeaderLink[];
  badgeText: string;
};

export function PublicHeader({ brand, links, badgeText }: PublicHeaderProps) {
  const sectionLinks = useMemo(
    () => links.filter((link) => link.href.startsWith("#")),
    [links],
  );
  const [activeHref, setActiveHref] = useState(
    sectionLinks[0]?.href ?? links[0]?.href ?? "",
  );

  useEffect(() => {
    if (!sectionLinks.length) return;

    const observers: IntersectionObserver[] = [];

    sectionLinks.forEach((link) => {
      const sectionId = link.href.slice(1);
      const sectionEl = document.getElementById(sectionId);
      if (!sectionEl) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveHref(link.href);
            }
          });
        },
        {
          root: null,
          rootMargin: "-35% 0px -50% 0px",
          threshold: 0,
        },
      );

      observer.observe(sectionEl);
      observers.push(observer);
    });

    return () => {
      observers.forEach((observer) => observer.disconnect());
    };
  }, [sectionLinks]);

  return (
    <nav className="fixed top-0 z-50 w-full border-b border-black/5 bg-[#f7faf7]/78 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="relative h-6 w-6">
              <span className="absolute left-0 top-0 h-4 w-4 rounded-sm bg-[#176d25]" />
              <span className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-[#176d25] bg-[#d8f4d7]" />
            </span>
            <span className="text-xl font-black tracking-[-0.02em] text-green-900">
              {brand}
            </span>
          </div>
          <div className="hidden items-center space-x-6 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                onClick={() => setActiveHref(link.href)}
                className={
                  link.href === activeHref
                    ? "rounded-full bg-[#d8f4d7] px-3 py-1 text-sm font-bold text-[#12581e] transition-colors"
                    : "text-sm font-bold text-gray-500 transition-colors hover:text-green-700"
                }
                href={link.href}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="rounded-full border border-[#9adf98] bg-[#d9f6d4] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0f4a16]">
          {badgeText}
        </div>
      </div>
    </nav>
  );
}
