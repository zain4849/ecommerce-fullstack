import jwt from "jsonwebtoken"


export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded// { id, role } 
    console.log('reached');
    
    next()
  } catch (err) {
    console.log('no jwt');
    
    res.status(401).json({ error: "Invalid token" })
  }
};

export const adminMiddleware = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Forbidden: Admins only" })
  }
  next()
};

