"use client";

// import { useRouter } from "next/navigation";
// import Button from "@/components/ui/Button";

// export default function NotFound() {
//   const router = useRouter();

//   return (
//     <div className="mx-auto flex h-screen flex-col items-center justify-center">
//       <div className="flex flex-col">
//         <p className="text-lg font-bold mb-2">404 Not Found</p>
//         <Button onClick={() => router.push("/")}>Back Home</Button>
//       </div>
//     </div>
//   );
// }

import Error from "next/error";

// This page renders when a route is requested that doesn't match the
// middleware and therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
