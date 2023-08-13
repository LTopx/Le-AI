import type { IconProps } from "./types";

export const Open_Router = ({
  size = 16,
  className,
  style,
  onClick,
}: IconProps) => (
  <svg
    className={className}
    style={style}
    width={size}
    height={size}
    onClick={onClick}
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
  >
    <g clipPath="url(#clip0_205_3)">
      <path
        d="M3 248.945C18 248.945 76 236 106 219C136 202 136 202 198 158C276.497 102.293 332 120.945 423 120.945"
        strokeWidth="90"
        fill="#94a3b8"
      ></path>
      <path
        d="M511 121.5L357.25 210.268L357.25 32.7324L511 121.5Z"
        fill="#94a3b8"
      ></path>
      <path
        d="M0 249C15 249 73 261.945 103 278.945C133 295.945 133 295.945 195 339.945C273.497 395.652 329 377 420 377"
        strokeWidth="90"
        fill="#94a3b8"
      ></path>
      <path
        d="M508 376.445L354.25 287.678L354.25 465.213L508 376.445Z"
        fill="#94a3b8"
      ></path>
    </g>
    <defs>
      <clipPath id="clip0_205_3">
        <rect width="512" height="512" fill="white"></rect>
      </clipPath>
    </defs>
  </svg>
);
