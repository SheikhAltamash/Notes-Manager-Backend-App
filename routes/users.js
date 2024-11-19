const express = require("express");
const { v4: uuidv4 } = require("uuid");
const validateSession = require("../utils/sessionValidation");

module.exports = (admin, db) => {
  const router = express.Router();
  router.post("/signup", async (req, res) => {
    const { email, password, name } = req.body;
    if (!email || !password || !name) {
      return res
        .status(400)
        .send({ message: "Name, email, and password are required" });
    }

    try {
      // Create a new user in Firebase Authentication
      const userRecord = await admin.auth().createUser({
        email,
        password,
        displayName: name,
      });

      // Save user profile to Firestore
      const userProfile = {
        name,
        email,
        createdAt: new Date(),
      };

      await db.collection("users").doc(userRecord.uid).set(userProfile);

      res.status(201).send({
        message: "User registered successfully",
        userID: userRecord.uid,
        
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        code: error.code,
      });
    }
  });
  // User Login and Session Creation
  router.post("/login", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Email and password are required" });
    }

    try {
      // Verify user credentials (placeholder logic; replace with real authentication)
      const userSnapshot = await db
        .collection("users")
        .where("email", "==", email)
        .get();
      if (userSnapshot.empty) {
        return res.status(401).send({ message: "Invalid email or password" });
      }

      // Generate session token
      const user = userSnapshot.docs[0].data();
      const sessionId = uuidv4();
      const sessionExpiration = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      // Store session in Firestore
      await db.collection("sessions").doc(sessionId).set({
        userId:  userSnapshot.docs[0].id,
        email,
        expiresAt: sessionExpiration,
      });

      res
        .status(200)
        .send({
          message: "User login successfully",
          UserID: userSnapshot.docs[0].id,
        });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  // Logout and delete session
  router.post("/logout", async (req, res) => {
    // const sessionId = req.headers.authorization;
    const id = req.body;
    try {
      await db.collection("sessions").doc(id).delete();
      res.status(200).send({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

 
  router.put("/edit", async (req, res) => {
    const { email, password, name ,id} = req.body;
    const userId = id;

    if (!email && !password && !name) {
      return res.status(400).send({
        message:
          "At least one field (email, password, or name) must be provided for update.",
      });
    }

    try {
      // Fetch user record
      const userRecord = await admin.auth().getUser(userId);

      // Update email if provided
      if (email) {
        await admin.auth().updateUser(userId, { email });
      }

      // Update password if provided
      if (password) {
        await admin.auth().updateUser(userId, { password });
      }

      // Update displayName if provided
      if (name) {
        await admin.auth().updateUser(userId, { displayName: name });

        // Update Firestore profile
        await db.collection("users").doc(userId).update({ name });
      }

      // Send success response
      res.status(200).send({
        message: "User details updated successfully",
        ...(email && { email }),
        ...(name && { name }),
      });
    } catch (error) {
      res.status(500).send({
        message: error.message,
        code: error.code,
      });
    }
  });

 
  return router;
};
