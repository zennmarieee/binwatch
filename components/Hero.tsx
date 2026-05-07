export default function Hero() {
  return (
           <section
             id="hero"
             className="hero-grid relative mx-auto max-w-5xl rounded-4xl border border-black/5 px-6 py-12 text-center backdrop-blur-sm sm:px-10"
           >
             <span className="mb-5 inline-flex rounded-full border border-[#9adf98] bg-[#d9f6d4] px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-[#0f4a16]">
               QR-Based Waste Reporting for Campuses
             </span>
             <h1 className="text-4xl font-black leading-tight tracking-[-0.02em] text-[#102013] sm:text-6xl">
               <span className="hero-brand-word">BinWatch</span> Smart Campus Waste Reporting
             </h1>
             <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#4c616c] sm:text-lg">
               Scan a bin QR code, report in seconds, and help staff respond
               faster. No login needed. Student ID is optional for points.
             </p>
   
             <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
               <a
                 href="#lookup"
                 className="inline-flex items-center justify-center rounded-full bg-[#176d25] px-6 py-3 font-bold text-white transition-all hover:-translate-y-0.5 hover:bg-[#12581e]"
               >
                 Student Lookup
               </a>
               <a
                 href="#how-it-works"
                 className="inline-flex items-center justify-center rounded-full border border-[#176d25] bg-white px-6 py-3 font-bold text-[#176d25] transition-all hover:-translate-y-0.5 hover:bg-[#eef8ef]"
               >
                 How It Works
               </a>
             </div>
           </section>

    );
}