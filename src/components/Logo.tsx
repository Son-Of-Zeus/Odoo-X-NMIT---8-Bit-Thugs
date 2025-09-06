import { Leaf } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Logo({ size = "md", className = "" }: LogoProps) {
  const sizes = {
    sm: "text-lg",
    md: "text-xl",
    lg: "text-2xl"
  };

  const iconSizes = {
    sm: 20,
    md: 24,
    lg: 28
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="bg-primary rounded-lg p-1.5">
        <Leaf className="text-primary-foreground" size={iconSizes[size]} />
      </div>
      <span className={`font-medium text-foreground ${sizes[size]}`}>
        EcoFinds
      </span>
    </div>
  );
}