import { motion, Variants } from "framer-motion";

export default function Bg() {
  const blurBgVariants: Variants = {
    open: {
      clipPath: "circle(140% at 95% 95%)",
      opacity: 1,
      transition: {
        opacity: {
          duration: 0.5,
        },
      },
    },
    closed: {
      clipPath: "circle(0% at 95% 95%)",
      opacity: 0,
      transition: {
        opacity: {
          duration: 0.5,
        },
      },
    },
  };
  return (
    <motion.div
      className="fixed inset-0 z-10 h-full w-full bg-white/60 backdrop-blur-md"
      variants={blurBgVariants}
    />
  );
}
