import React from "react";
// Ajusto el footer para que quede bien alineado en toda la app
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
