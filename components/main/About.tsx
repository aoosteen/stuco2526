import React from "react";
import { CardCarousel } from "../ui/card-carousel";
const About = () => {
  
  return (
    <div className="  flex justify-center items-center ">
      <CardCarousel/>
      {/* <div className="absolute top-1/2 left-24 ">
        <ChevronLeft size={48} className="stroke-1" />
      </div>
      <div className="absolute top-1/2 right-24 ">
        <ChevronRight size={48} className="stroke-1" />
      </div> */}
      {/* <div className=" w-full h-full  flex justify-center items-center">
        <div className=" relative w-full h-full">
          <motion.div
          className=" absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-1">
            <Image
              src="/main/PinkBlob.svg"
              width={700}
              height={700}
              alt="Pink blob"
            />

           <div className="text-center -translate-y-20 space-y-4">
            <h1 className="text-rose-900 text-4xl lg:text-6xl font-normal">Members</h1>
            <p className="text-rose-900">Dolore mollit commodo velit. Cillum non reprehenderit aliqua aute veniam consequat culpa exercitation. Consectetur velit commodo ipsum non culpa deserunt incididunt minim. Lorem do minim consequat irure ea enim id id.</p>
           </div>
          </motion.div>
          <motion.div className="absolute   top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2  ">
            <Image
              src="/main/YellowBlob.svg"
              width={700}
              height={700}
              alt="Yellow blob"
            />
          </motion.div>
          <motion.div className=" absolute  top-1/2 -translate-y-1/2 left-3/5 -translate-x-1/2 ">
            <Image
              src="/main/BlueBlob.svg"
              width={700}
              height={700}
              alt="Blue blob"
            />
          </motion.div>
        </div>
      </div> */}
      
    </div>
  );
};

export default About;
