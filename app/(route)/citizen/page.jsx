"use client";

import { useState, useEffect } from "react";
import { CitizenDashboard } from "@/components/Citizen/CitizenDashboard";
import { getNotifications } from "@/lib/mockData";
import { NotificationsPanel } from "@/components/NotificationPanel";

export default function Page() {
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const data = getNotifications();
    console.log("Unread notifications:", data);
    setUnreadCount(data.length);
  }, []);

  return (
    <>
      <CitizenDashboard
        onNotificationsClick={() => setIsNotificationsOpen(true)}
        unreadCount={unreadCount}
      />

      <NotificationsPanel
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
      />
    </>
  );
}
