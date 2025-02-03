"use client";

import { Flip, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function Toast() {
  const primaryColor =
    typeof window !== "undefined"
      ? `hsl(${getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim()
          .split(" ")
          .join(", ")})`
      : "";

  return (
    <ToastContainer
      position="top-center"
      autoClose={4000}
      closeOnClick
      theme="colored"
      rtl={false}
      transition={Flip}
      toastStyle={{
        backgroundColor: primaryColor,
      }}
    />
  );
}

export function defaultLinkToast() {
  return toast.info("Links are for show only and aren’t active.");
}
