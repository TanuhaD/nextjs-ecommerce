"use client";

import { useEffect, useState } from "react";

const getNavbarHeight = () => document.querySelector("#navbar")?.clientHeight;
const getFooterHeight = () => document.querySelector("#footer")?.clientHeight;
const getParentPadding = () => {
  const parentElement = document.querySelector("#forbidden")?.parentElement;
  if (!parentElement) return 0;
  const parentStyles = window.getComputedStyle(parentElement);
  const paddingTop = parseInt(parentStyles.getPropertyValue("padding-top"));
  return paddingTop;
};
export default function ForbiddenPage() {
  const [contentHeight, setContentHeight] = useState(100);
  useEffect(() => {
    const navbarheight = getNavbarHeight() || 0;
    const footerheight = getFooterHeight() || 0;
    const viewportHeight = window.innerHeight;
    const parentPadding = getParentPadding();
    const contentHeight =
      viewportHeight - navbarheight - footerheight - parentPadding * 2;
    setContentHeight(contentHeight);
  }, []);

  return (
    <div
      id="forbidden"
      style={{ height: contentHeight + "px", minHeight: "100px" }}
    >
      You are denied access to this page
    </div>
  );
}
