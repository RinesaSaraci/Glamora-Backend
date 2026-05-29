const prisma = require("../lib/prisma");

const verifySalonOwnership = async (req, res, next) => {
  try {
    // Re-use salon already fetched by attachTenantContext when present,
    // otherwise look it up now to avoid a redundant DB round-trip.
    let salon = req.salon;

    if (!salon) {
      const salonId = Number(req.params.salonId);
      if (isNaN(salonId)) {
        return res.status(400).json({ error: "Invalid Salon ID" });
      }

      salon = await prisma.salon.findUnique({ where: { id: salonId } });

      if (!salon) {
        return res.status(404).json({ error: "Salon not found" });
      }

      req.salon = salon;
      req.tenantId = salon.tenantId ?? null;
    }

    const { role, id: userId, tenantId: userTenantId } = req.user;

    // SUPERADMIN bypasses all checks — global access
    if (role === "SUPERADMIN") return next();

    // ADMIN: verify they belong to the same tenant as the salon
    if (role === "ADMIN") {
      if (userTenantId && salon.tenantId && Number(userTenantId) !== Number(salon.tenantId)) {
        return res.status(403).json({ error: "Forbidden - Salon belongs to a different tenant" });
      }
      return next();
    }

    // OWNER: can only access their own salon
    if (role === "OWNER") {
      if (salon.ownerId !== userId) {
        return res.status(403).json({ error: "Forbidden - You do not own this salon" });
      }
      return next();
    }

    // Any other role with no match — deny
    return res.status(403).json({ error: "Forbidden" });
  } catch (error) {
    res.status(500).json({ error: "Internal server verification error" });
  }
};

module.exports = { verifySalonOwnership };
