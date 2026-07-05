import type { ReactNode, HTMLAttributes } from "react";

type GlassCardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

function GlassCard({
  children,
  className = "",
  ...props
}: GlassCardProps) {
  return (
    <div
      className={`bg-white/[0.04] backdrop-blur-xl border border-white/10 rounded-2xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
export default GlassCard;