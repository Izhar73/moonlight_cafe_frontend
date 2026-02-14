import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./../../asset/breadcrumbs.css";

export default function Breadcrumbs() {
  const location = useLocation();

  // Hide breadcrumbs on main user pages
  const hideOnPaths = [
  "/",
  "/home",
  "/menu",
  "/cart",
  "/about",
  "/contact",
  "/login",
  "/yourorders",
  "/yourorder",
  "/orders",
];

if (hideOnPaths.includes(location.pathname.toLowerCase())) {
  return null;
}


  if (hideOnPaths.includes(location.pathname.toLowerCase())) {
    return null;
  }

  const pathnames = location.pathname.split("/").filter((x) => x);

  if (pathnames.length === 0) return null;

  return (
    <nav className="breadcrumbs">
      {pathnames.map((name, index) => {
        const routePath = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        // Capitalize dynamic name
        const displayName = name.replace(/-/g, " ");
        const formattedName =
          displayName.charAt(0).toUpperCase() + displayName.slice(1);

        return (
          <span key={index}>
            {index > 0 && <span className="separator"> / </span>}

            {isLast ? (
              <span className="breadcrumb-current">{formattedName}</span>
            ) : (
              <Link to={routePath} className="breadcrumb-link">
                {formattedName}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
