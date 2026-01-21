import prisma from "@/generated/prisma";

export const getUsers = async () => {
  try {
    const users = await prisma.user.findMany({
      select: {
        email: true,
        name: true,
        phoneNumber: true,
        Screen: true
      }
    })
    return users;
  } catch (error: any) {
    console.error("Kullanıcılar verisi çekilirken bir hata oluştu:", error.message);
    throw new Error("Veri çekme işlemi başarısız.");
  }
}

export const getUserById = async (id: string) => {
  try {
    return await prisma.user.findFirst({
      select: {
        email: true,
        name: true,
        phoneNumber: true,
        Screen: true
      }
    })
  } catch (error: any) {
    console.error("Kullanıcı verisi çekilirken bir hata oluştu:", error.message);
    throw new Error("Veri çekme işlemi başarısız.");
  }
}

export const setIpAddress = async (userId: string, ip: string) => {
  try {
    const updatedUser = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        ip: ip,
      },
      select: {
        ip: true
      }
    });
    return updatedUser;
  } catch (error: any) {
    console.error("IP adresi güncellenirken bir hata oluştu:", error.message);
    throw new Error("IP adresi güncelleme işlemi başarısız.");
  }
}