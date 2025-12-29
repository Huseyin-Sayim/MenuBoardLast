export async function getOverviewData() {
  // Fake delay
  await new Promise((resolve) => setTimeout(resolve, 2000));

  return {
    screen: {
      value: 5,
    },
    design: {
      value: 20,
    },
    gallery: {
      value: 3456,
    },
  };
}

export async function getChatsData() {
  // Fake delay

  return [
    {
      name: "Admin",
      profile: "/images/user/user-03.png",
      isActive: true,
      lastMessage: {
        content: "See you tomorrow at the meeting!",
        type: "text",
        timestamp: "2024-12-19T14:30:00Z",
        isRead: false,
      },
      unreadCount: 3,
    }
  ];
}