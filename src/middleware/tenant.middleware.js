const prisma = require("../lib/prisma");

const verifySalonOwnership = async (req, res, next) => {
  try {
    const salonId = Number(req.params.salonId);
    if (isNaN(salonId)) {
      return res.status(400).json({ error: "Invalid Salon ID" });
    }

    const salon = await prisma.salon.findUnique({
      where: { id: salonId },
    });

    if (!salon) {
      return res.status(404).json({ error: "Salon not found" });
    }

    // Permit access if user is ADMIN or owns the Salon
    if (req.user.role !== "ADMIN" && salon.ownerId !== req.user.id) {
      return res.status(403).json({ error: "Forbidden - You do not own this salon" });
    }

    next();
  } catch (error) {
    res.status(500).json({ error: "Internal server verification error" });
  }
};

module.exports = { verifySalonOwnership };
