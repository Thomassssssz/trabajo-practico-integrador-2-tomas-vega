import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center">
      <div className="container mx-auto">
        &copy; {new Date().getFullYear()} Tomas Vega — Trabajo Práctico
        Integrador 2 III
      </div>
    </footer>
  );
};

export default Footer;
