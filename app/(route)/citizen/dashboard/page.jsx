"use client";

import React from "react";
import { toast } from "sonner";

const page = () => {
  toast.warning("Session expired — please sign in again.");
  console.log("Toast fired");
  return <div>page</div>;
};

export default page;
