type BrandMarkProps = {
  label?: string;
  subtitle?: string;
  size?: "sm" | "md" | "lg";
  tone?: "light" | "dark";
  className?: string;
};

const SIZE_STYLES = {
  sm: {
    mark: "h-7 w-7",
    label: "text-base",
    subtitle: "text-[11px]",
  },
  md: {
    mark: "h-8 w-8",
    label: "text-lg",
    subtitle: "text-xs",
  },
  lg: {
    mark: "h-10 w-10",
    label: "text-2xl sm:text-3xl",
    subtitle: "text-sm",
  },
} as const;

export default function BrandMark({
  label = "BinWatch",
  subtitle,
  size = "md",
  tone = "light",
  className = "",
}: BrandMarkProps) {
  const styles = SIZE_STYLES[size];
  const titleColor = tone === "dark" ? "text-white" : "text-[#102013]";
  const subtitleColor = tone === "dark" ? "text-white/65" : "text-[#4c616c]";
  const squareColor = tone === "dark" ? "bg-white/20" : "bg-[#176d25]";
  const ringColor = tone === "dark" ? "border-white" : "border-[#176d25]";
  const circleColor = tone === "dark" ? "bg-white/10" : "bg-[#d8f4d7]";

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      <span className={`relative inline-flex shrink-0 items-center justify-center ${styles.mark}`}>
        <span className={`absolute left-0 top-0 h-3/5 w-3/5 rounded-[0.35rem] ${squareColor}`} />
        <span
          className={`absolute bottom-0 right-0 h-3/5 w-3/5 rounded-full border-2 ${ringColor} ${circleColor}`}
        />
      </span>
      <span className="min-w-0">
        <span className={`block font-black tracking-[-0.02em] ${styles.label} ${titleColor}`}>
          {label}
        </span>
        {subtitle ? (
          <span className={`block ${styles.subtitle} ${subtitleColor}`}>
            {subtitle}
          </span>
        ) : null}
      </span>
    </div>
  );
}