const express = require("express");
const validateSession = require("../utils/sessionValidation");

module.exports = (db) => {
  const router = express.Router();
  // Create a new note
  router.post("/create", async (req, res) => {
    const { userId:userID, title, content } = req.body;
    const id = userID;
    if (!title || !content) {
      return res
        .status(400)
        .send({ message: "Title and content are required" });
    }

    try {
      const userId = id; // Get user ID from session
      const noteData = {
        title,
        content,
        timestamp: new Date(),
        userId, // Store the userId to associate the note
      };

      const newNoteRef = await db.collection("notes").add(noteData);
      res.status(201).send({ noteId: newNoteRef.id, ...noteData });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  // Get all notes for the authenticated user
  router.get("/", async (req, res) => {
        const { userId:id } = req.body;
const userId = id
    try {
      const notesSnapshot = await db
        .collection("notes")
        .where("userId", "==", userId)
        .get();
      if (notesSnapshot.empty) {
        return res
          .status(404)
          .send({ message: "No notes found for this user" });
      }

      const notes = [];
      notesSnapshot.forEach((doc) => {
        notes.push({ noteId: doc.id, ...doc.data() });
      });

      res.status(200).send(notes);
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

  // Get a specific note by ID
  router.post("/getnote",  async (req, res) => {
    const { id:noteId,userId } = req.body;
     // Get user ID from session

    try {
      const noteDoc = await db.collection("notes").doc(noteId).get();
      if (!noteDoc.exists) {
        return res.status(404).send({ message: "Note not found" });
      }

      const noteData = noteDoc.data();
      if (noteData.userId !== userId) {
        return res
          .status(403)
          .send({ message: "You do not have access to this note" });
      }

      res.status(200).send({ noteId: noteDoc.id, ...noteData });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });
    router.put("/edit", async (req, res) => {
    const { title, content, id:noteId } = req.body;

    // Ensure at least one field is provided for update
    if (!title && !content) {
      return res.status(400).send({
        message:
          "At least one field (title or content) must be provided for update.",
      });
    }

    try {
      // Fetch the note from Firestore
      const noteDoc = await db.collection("notes").doc(noteId).get();

      // Check if the note exists
      if (!noteDoc.exists) {
        return res.status(404).send({ message: "Note not found." });
      }

      // Prepare the update data
      const updateData = {};
      if (title) updateData.title = title;
      if (content) updateData.content = content;

      // Update the note in Firestore
      await db.collection("notes").doc(noteId).update(updateData);

      res.status(200).send({ message: "Note updated successfully" });
    } catch (error) {
      res.status(500).send({ message: error.message });
    }
  });

 // Delete Note Route
router.delete("/delete", async (req, res) => {
  const { userId, id:noteId } = req.body;

  // Validate inputs
  if (!userId || !noteId) {
    return res.status(400).send({
      message: "Both userId and noteId are required to delete a note.",
    });
  }

  try {
    // Reference to the note in Firestore
    const noteRef = db
      .collection("notes")
      .doc(noteId);

    // Fetch the note
    const noteDoc = await noteRef.get();

    // Check if the note exists
    if (!noteDoc.exists) {
      return res.status(404).send({ message: "Note not found." });
    }

    // Delete the note from Firestore
    await noteRef.delete();

    res.status(200).send({ message: "Note deleted successfully." });
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});


  return router;
};
