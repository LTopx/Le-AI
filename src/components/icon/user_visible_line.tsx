import type { IconProps } from "./types";

export const User_visible_line = ({
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
    <g fill="none" fillRule="evenodd">
      <path d="M24 0v24H0V0h24ZM12.594 23.258l-.012.002l-.071.035l-.02.004l-.014-.004l-.071-.036c-.01-.003-.019 0-.024.006l-.004.01l-.017.428l.005.02l.01.013l.104.074l.015.004l.012-.004l.104-.074l.012-.016l.004-.017l-.017-.427c-.002-.01-.009-.017-.016-.018Zm.264-.113l-.014.002l-.184.093l-.01.01l-.003.011l.018.43l.005.012l.008.008l.201.092c.012.004.023 0 .029-.008l.004-.014l-.034-.614c-.003-.012-.01-.02-.02-.022Zm-.715.002a.023.023 0 0 0-.027.006l-.006.014l-.034.614c0 .012.007.02.017.024l.015-.002l.201-.093l.01-.008l.003-.011l.018-.43l-.003-.012l-.01-.01l-.184-.092Z" />
      <path
        fill="currentColor"
        d="M11 2a5 5 0 1 0 0 10a5 5 0 0 0 0-10ZM8 7a3 3 0 1 1 6 0a3 3 0 0 1-6 0Zm2.337 8.021a1 1 0 0 0-.127-1.996c-2.21.14-4.195.858-5.651 1.813c-.728.478-1.348 1.031-1.796 1.63C2.32 17.057 2 17.755 2 18.5c0 1.535 1.278 2.346 2.495 2.763c1.28.439 2.99.638 4.832.707a1 1 0 0 0 .075-1.998c-1.791-.068-3.263-.26-4.258-.6c-.932-.32-1.11-.635-1.139-.81L4 18.5c0-.168.079-.454.363-.834c.279-.372.712-.774 1.293-1.156c1.161-.761 2.812-1.37 4.68-1.489ZM17 13.89c1.406 0 2.632.632 3.49 1.39a5.3 5.3 0 0 1 1.057 1.259c.252.427.453.94.453 1.462c0 .523-.2 1.035-.453 1.462a5.3 5.3 0 0 1-1.057 1.26c-.858.757-2.084 1.39-3.49 1.39c-1.406 0-2.632-.633-3.49-1.39a5.3 5.3 0 0 1-1.057-1.26C12.2 19.035 12 18.522 12 18c0-.523.2-1.035.453-1.462a5.3 5.3 0 0 1 1.057-1.26c.858-.757 2.084-1.39 3.49-1.39Zm0 2c-.803 0-1.577.368-2.167.889a3.31 3.31 0 0 0-.657.775a1.536 1.536 0 0 0-.155.339l-.02.087v.042l.02.087c.023.077.068.19.155.34c.144.243.366.517.657.774c.59.52 1.364.89 2.167.89c.803 0 1.577-.37 2.167-.89a3.31 3.31 0 0 0 .657-.775c.087-.148.132-.262.155-.339l.02-.087A.176.176 0 0 0 20 18l-.008-.058a1.376 1.376 0 0 0-.168-.39a3.31 3.31 0 0 0-.657-.774c-.59-.52-1.364-.89-2.167-.89Zm.087 1.115a.667.667 0 0 0 .91.91l.003.086a1 1 0 1 1-.913-.996Z"
      />
    </g>
  </svg>
);