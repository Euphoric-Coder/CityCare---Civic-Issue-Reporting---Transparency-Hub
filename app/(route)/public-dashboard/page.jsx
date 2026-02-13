"use client";

import { PublicDashboard } from "@/components/PublicDashboard";
import { PublicNavbar } from "@/components/PublicNavbar";
import React from "react";

const page = () => {
  return (
    <div>
      <PublicNavbar />
      <div className="text-center py-12">Public dashboard coming soon... </div>
      {/* <PublicDashboard /> */}
    </div>
  );
};

export default page;
