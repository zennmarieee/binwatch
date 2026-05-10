export const homepageContent = {
  header: {
    brand: "BinWatch",
    badgeText: "Public Access",
    links: [
      { label: "Home", href: "#hero", isActive: true },
      { label: "Lookup", href: "#lookup" },
      { label: "How It Works", href: "#how-it-works" },
    ],
  },
  howItWorks: [
    {
      step: "01",
      title: "Scan the QR code",
      description: "Opens the report form for that bin.",
    },
    {
      step: "02",
      title: "Submit the report",
      description: "Pick a status and add Student ID if you want points.",
    },
    {
      step: "03",
      title: "Staff resolves it",
      description: "Staff reviews it and updates the bin.",
    },
  ],
} as const;
