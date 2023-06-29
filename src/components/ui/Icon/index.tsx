import React from "react";
import { Icon } from "@iconify/react";
import type { IconifyIcon } from "@iconify/react";

interface IIconProps {
  color?: string;
  icon: IconifyIcon;
  className?: string;
  style?: React.CSSProperties;
  size?: number;
  onClick?: (e: any) => void;
}

const LIcon: React.FC<IIconProps> = ({
  color,
  icon,
  size = 16,
  className,
  style,
  onClick,
}) => {
  if (!icon) return null;

  return (
    <Icon
      className={className}
      style={style}
      color={color}
      height={size}
      icon={icon}
      onClick={onClick}
    />
  );
};

export default LIcon;
