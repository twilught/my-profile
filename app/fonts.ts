import { Prompt } from "next/font/google";

export const fontSans = Prompt({
  subsets: ["thai","latin"],
  weight: ["300","400","500","600","700"],
  variable: "--font-sans",
  display: "swap",
});
