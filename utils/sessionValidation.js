// Middleware to validate session
module.exports = validateSession = async (req, res, next) => {
  const sessionId = req.headers.authorization;

  if (!sessionId) {
    return res.status(401).send({ message: "Session token required" });
  }

  try {
    const sessionDoc = await db.collection("sessions").doc(sessionId).get();
    if (!sessionDoc.exists || sessionDoc.data().expiresAt < Date.now()) {
      return res.status(401).send({ message: "Session expired or invalid" });
    }

    req.user = sessionDoc.data();
    next();
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
};
