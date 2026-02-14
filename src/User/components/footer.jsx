import React from "react";
import "./../../asset/footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <p>© {new Date().getFullYear()} Moonlight Cafe. All Rights Reserved.</p>
      <p>Made with ❤️ by Saiyed Izhar</p>
    </footer>
  );
}
