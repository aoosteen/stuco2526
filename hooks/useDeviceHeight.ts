import React from "react";

export const useDeviceHeight = () => {
  const [deviceHeight, setDeviceHeight] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => {
      setDeviceHeight(window.innerHeight);
    };

    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceHeight;
};
