import { motion } from "framer-motion";
import { cn } from "@/lib";

interface IconProps {
  onClick: (e: any) => void;
}

export default function Icon(props: IconProps) {
  return (
    <div
      className={cn(
        "flex bottom-7 right-7 justify-center items-center",
        "md:hidden fixed w-10 h-10 rounded-full z-50",
        "bg-neutral-800 dark:bg-neutral-700/90"
      )}
      onClick={props.onClick}
    >
      <motion.div
        variants={{
          open: { transition: { staggerChildren: 0 } },
          closed: { transition: { staggerChildren: 0 } },
        }}
      >
        <svg
          viewBox="0 0 20 20"
          strokeLinecap="round"
          className="h-4 w-4 stroke-zinc-100 stroke-[1.5] dark:stroke-zinc-100"
        >
          <motion.path
            d="M 2 2.5 L 20 2.5"
            variants={{
              open: { d: "M 3 16.5 L 17 2.5" },
              closed: { d: "M 2 2.5 L 20 2.5" },
            }}
          />
          <motion.path
            d="M 2 9.423 L 20 9.423"
            variants={{
              open: { opacity: "0" },
              closed: { opacity: "1" },
            }}
          />
          <motion.path
            d="M 2 16.346 L 20 16.346"
            variants={{
              open: { d: "M 3 2.5 L 17 16.346" },
              closed: { d: "M 2 16.346 L 20 16.346" },
            }}
          />
        </svg>
      </motion.div>
    </div>
  );
}
