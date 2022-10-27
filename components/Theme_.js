import React from "react";
import Image from "next/image";

const Theme_ = () => {
  // Select_theme_handler
  const Select_theme_handler = () => {
    window.location.replace("/dashboard");
  };
  return (
    <div className="flex items-center flex-col pt-8 pb-16 pl-16 pr-16">
      <h1 className="text-3xl font-bold">THEMES</h1>
      <p className="border-b-4 p-2 w-16 border-yellow-400"></p>
      <div className="grid grid-cols-4 gap-16 mt-4">
        <Image
          onClick={Select_theme_handler}
          src="/theme.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme1.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme3.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme4.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme5.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme6.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme7.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme8.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme1.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme4.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme6.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
        <Image
          onClick={Select_theme_handler}
          src="/theme8.png"
          alt="Logo"
          width="1400"
          height="1000"
          className="hadow-xl hover:scale-105 transition-all"
        />
      </div>
    </div>
  );
};

export default Theme_;
