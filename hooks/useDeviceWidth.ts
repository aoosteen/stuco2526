import React from "react";

export const useDeviceWidth = () => {
  const [deviceWidth, setDeviceWidth] = React.useState<number>(0);

  React.useEffect(() => {
    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };

    handleResize(); // Set initial width
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return deviceWidth;
}