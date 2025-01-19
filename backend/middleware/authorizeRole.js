import { User } from "../models/user.model.js"; // Use named import

const authorizeRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      // Ensure the user ID is present in the request
      if (!req.userId) {
        return res.status(403).json({ message: "Access Denied - Missing User ID!" });
      }

      // Fetch user details from the database
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: "User Not Found!" });
      }

      // Check if user's role is allowed
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({ message: "Access Denied - Unauthorized Role!" });
      }

      // Attach user details to req for further use
      req.user = user;
      next();
    } catch (error) {
      console.error("Error in authorizeRole middleware:", error);
      return res.status(500).json({ message: "Server Error!" });
    }
  };
};

export default authorizeRole; 
