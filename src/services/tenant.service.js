const prisma = require("../lib/prisma");

const createTenant = async (data) => {
  const slug = data.slug || data.name.toLowerCase().replace(/\s+/g, "-");
  return await prisma.tenant.create({
    data: { name: data.name, slug },
  });
};

const getAllTenants = async () => {
  return await prisma.tenant.findMany({
    include: {
      _count: { select: { salons: true, users: true } },
      salons: {
        select: { id: true, name: true, city: true, owner: { select: { id: true, name: true } } }
      },
      users: {
        select: { id: true, name: true, email: true, role: true }
      },
    },
    orderBy: { createdAt: "asc" },
  });
};

const getTenantById = async (id) => {
  return await prisma.tenant.findUnique({
    where: { id: Number(id) },
    include: {
      salons: { select: { id: true, name: true, city: true } },
      users: { select: { id: true, name: true, email: true, role: true } },
    },
  });
};

const assignUserToTenant = async (userId, tenantId) => {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });
  if (!user) throw new Error("User not found");

  if (tenantId !== null) {
    const tenant = await prisma.tenant.findUnique({ where: { id: Number(tenantId) } });
    if (!tenant) throw new Error("Tenant not found");
  }

  return await prisma.user.update({
    where: { id: Number(userId) },
    data: { tenantId: tenantId ? Number(tenantId) : null },
    select: { id: true, name: true, email: true, role: true, tenantId: true },
  });
};

module.exports = { createTenant, getAllTenants, getTenantById, assignUserToTenant };
