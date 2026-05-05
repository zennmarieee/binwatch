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
  publicLookup: {
    title: "Check a Student ID",
    description: "See points and recent reports without logging in.",
    metrics: [
      { label: "Points", value: "2,480" },
      { label: "Reports", value: "31" },
      { label: "Rank", value: "#142" },
    ],
    history: [
      { label: "North Library Bin Report", value: "+50" },
      { label: "Science Annex Overflow", value: "+25" },
      { label: "Weekly Participation Bonus", value: "+200" },
    ],
  },
  campusStats: [
    { label: "Reports today", value: "24" },
    { label: "Active bins", value: "8" },
    { label: "Resolve rate", value: "96%" },
  ],
} as const;
