const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden - no access" });
    }
    next();
  };
};

module.exports = roleMiddleware;