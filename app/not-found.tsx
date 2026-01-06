import Image from "next/image";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-8xl font-bold mb-4">404</h1>
      <p className="text-xl mb-4">Page Not Found</p>
      <Image
        src={"/ErrorAsset.png"}
        alt="Error Asset"
        width={400}
        height={400}
        className="max-w-full h-auto"
      />
    </div>
  );
};

export default NotFound;
