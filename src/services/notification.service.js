const prisma = require("../lib/prisma");

const createNotification = async (userId, data) => {
  return await prisma.notification.create({
    data: {
      userId: Number(userId),
      title: data.title,
      message: data.message,
      type: data.type || "GENERAL",
    },
  });
};

const getNotifications = async (userId) => {
  return await prisma.notification.findMany({
    where: { userId: Number(userId) },
    orderBy: { createdAt: "desc" },
  });
};

const markAsRead = async (id, userId) => {
  const notification = await prisma.notification.findUnique({
    where: { id: Number(id) },
  });
  if (!notification) throw new Error("Notification not found");
  if (notification.userId !== Number(userId))
    throw new Error("Forbidden");

  return await prisma.notification.update({
    where: { id: Number(id) },
    data: { isRead: true },
  });
};

const markAllAsRead = async (userId) => {
  await prisma.notification.updateMany({
    where: { userId: Number(userId), isRead: false },
    data: { isRead: true },
  });
  return { message: "All notifications marked as read" };
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead,
};
