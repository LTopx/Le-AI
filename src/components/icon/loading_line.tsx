import type { IconProps } from "./types";

export const Loading_line = ({
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
    viewBox="0 0 24 24"
  >
    <defs>
      <linearGradient
        id="mingcuteLoadingLine0"
        x1="50%"
        x2="50%"
        y1="5.271%"
        y2="91.793%"
      >
        <stop offset="0%" stopColor="currentColor" />
        <stop offset="100%" stopColor="currentColor" stopOpacity=".55" />
      </linearGradient>
      <linearGradient
        id="mingcuteLoadingLine1"
        x1="50%"
        x2="50%"
        y1="8.877%"
        y2="90.415%"
      >
        <stop offset="0%" stopColor="currentColor" stopOpacity="0" />
        <stop offset="100%" stopColor="currentColor" stopOpacity=".55" />
      </linearGradient>
    </defs>
    <g fill="none">
      <path d="M24 0v24H0V0h24ZM12.593 23.258l-.011.002l-.071.035l-.02.004l-.014-.004l-.071-.035c-.01-.004-.019-.001-.024.005l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.017-.018Zm.265-.113l-.013.002l-.185.093l-.01.01l-.003.011l.018.43l.005.012l.008.007l.201.093c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.004-.011l.017-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <path
        fill="url(#mingcuteLoadingLine0)"
        d="M8.886.006a1 1 0 0 1 .22 1.988A8.001 8.001 0 0 0 10 17.944v2c-5.523 0-10-4.476-10-10C0 4.838 3.848.566 8.886.007Z"
        transform="translate(2 2.055)"
      />
      <path
        fill="url(#mingcuteLoadingLine1)"
        d="M14.322 1.985a1 1 0 0 1 1.392-.248A9.988 9.988 0 0 1 20 9.945c0 5.523-4.477 10-10 10v-2a8 8 0 0 0 4.57-14.567a1 1 0 0 1-.248-1.393Z"
        transform="translate(2 2.055)"
      />
    </g>
  </svg>
);
