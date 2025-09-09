"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import React from "react";

const page = () => {
  return (
    <div className="w-screen h-screen bg-orange-200 grid place-items-center">
      <Link href={"/"} className="text-black">
        click
        <motion.div
        animate={{
            y:100
        }}
        className="bg-green-200 h-10 w-10"></motion.div>
      </Link>
    </div>
  );
};

export default page;
