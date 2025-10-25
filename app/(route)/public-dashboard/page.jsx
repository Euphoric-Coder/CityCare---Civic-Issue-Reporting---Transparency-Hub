"use client";

import { PublicDashboard } from "@/components/PublicDashboard";
import { PublicNavbar } from "@/components/PublicNavbar";
import React from "react";

const page = () => {
  return (
    <div>
        <PublicNavbar />
      <PublicDashboard />
    </div>
  );
};

export default page;
