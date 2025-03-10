"use client";
import React from "react";

const Home = () => {
  const [anio, setAnio] = React.useState(new Date().getFullYear());

  return (
    <div
      className="flex flex-col items-center justify-center h-screen bg-black"
      style={{
        backdropFilter: "blur(10px)",
        background:
          "linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)),url('/fondo.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="text-center">
        <h1 className="text-white text-5xl font-bold mb-4">Bienvenido a Suzuki Palmas API</h1>
        <p className="text-white text-xl mb-4">Digitalia - Wiboo</p>
        <p className="text-white text-sm">&copy; {anio}</p>
      </div>
    </div>
  );
};

export default Home;
