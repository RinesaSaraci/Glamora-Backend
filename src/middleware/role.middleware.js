const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (req.user.role === "SUPERADMIN") return next();
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden - no access" });
    }
    next();
  };
};

module.exports = roleMiddleware;