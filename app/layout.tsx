import "./globals.css";
import { Inter } from "next/font/google";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { Toaster } from "@/components/ui/toaster";
import { CreateUserWrapper } from "@/providers/CreateUserWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Blockchain-Based Claim System",
  description:
    "Secure and efficient insurance claim processing using blockchain technology",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          {/* <SignedOut>
            <SignInButton />
          </SignedOut> */}
          <SignedIn>
            <UserButton />
          </SignedIn>
          <CreateUserWrapper>{children}</CreateUserWrapper>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  );
}
