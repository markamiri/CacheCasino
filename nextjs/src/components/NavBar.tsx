"use client";

import Image from "next/image";
import Link from "next/link";

import { Menu } from "lucide-react";
import {
  ClerkProvider,
  SignInButton,
  SignedIn,
  SignedOut,
  UserButton,
} from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { syncUser } from "@/actions/user.action";
import { useState } from "react";
import { useUser } from "@clerk/nextjs"; // ✅ Import client-side auth
import { useEffect } from "react";
import { createPortal } from "react-dom";
import CashOutModal from "@/components/CashoutModal";
import { useRouter } from "next/navigation";
import MatchHistoryButton from "@/components/MatchHistory";

function NavBar() {
  const { isSignedIn, user } = useUser(); // ✅ Get user info from Clerk
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (isSignedIn && user) {
      syncUser(); // ✅ Call syncUser only if the user is signed in
    }
  }, [isSignedIn, user]);

  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);

  return (
    <nav className="sticky top-0 w-full border-b bg-[#201d39] backdrop-blur supports-[backdrop-filter]:bg-[#201d39]/60 z-50">
      {/* ✅ ROW 1 - Main Navbar, #1D1E39 bg is very nice */}
      <div className="flex justify-between items-center py-3 px-4 lg:px-8 ">
        {/* 1️⃣ Company Logo */}
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/images/logo/cache_logo (1).png"
              alt="Company Logo"
              width={100}
              height={40}
              className="w-32 h-16 object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* 2️⃣ Search Bar */}
        <div className="hidden md:flex flex-1 mx-4">
          <input
            type="text"
            placeholder="Search markets"
            className="w-full max-w-lg h-10 border border-gray-500 rounded-lg px-4 text-white bg-transparent outline-none focus:border-white"
          />
        </div>

        {/* 3️⃣ Main Navigation Buttons */}
        <div className="hidden lg:flex space-x-6">
          <button className="px-4 py-2 bg-gray-800 rounded-md">temp1</button>
          <button className="px-4 py-2 bg-gray-800 rounded-md">temp2</button>
          <button className="px-4 py-2 bg-gray-800 rounded-md">temp3</button>
          <button className="px-4 py-2 bg-gray-800 rounded-md">temp4</button>

          <MatchHistoryButton />
        </div>

        {/* 4️⃣ Portfolio Button + Login & Signup */}
        <div className="hidden md:flex gap-4 items-center ml-4 ">
          {user && ( // ✅ Only show if user is logged in
            <div>
              {/*<button className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
                Portfolio
              </button> */}

              {/* Modal */}
              <button
                className="bg-blue-500 px-4 py-2 rounded-lg"
                onClick={() => setIsModalOpen(true)}
              >
                Cash
              </button>

              <CashOutModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              />
            </div>
          )}

          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-yellow-400 hover:underline">
                Log In
              </button>
            </SignInButton>

            <button className="bg-yellow-400 text-black px-4 py-2 rounded-lg">
              Sign Up
            </button>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </div>

        {/* 5️⃣ Hamburger Menu (Mobile Only) */}
        <button className="lg:hidden text-white">
          <Menu size={24} />
        </button>
      </div>

      {/* ✅ ROW 2 - Secondary Navbar */}
      <div className="secondNavBarRow">
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp1
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp2
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp3
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp4
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp5
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp6
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp7
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp8
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp9
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp10
        </button>
        <button className="relative text-white hover:text-gray-400 after:block after:h-[2px] after:bg-white after:w-0 after:transition-all after:duration-300 after:mt-1 hover:after:w-full">
          temp11
        </button>
      </div>
    </nav>
  );
}

export default NavBar;
