if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const userRoutes = require("./routes/users");
const noteRoutes = require("./routes/notes");
const admin = require("firebase-admin");
const serviceAccountKey = {
  type: "service_account",
  project_id: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: process.env.PRIVATE_KEY.replace(/\\n/g, "\n"), // Handle newline characters in env variables
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: process.env.AUTH_URI,
  token_uri: process.env.TOKEN_URI,
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
  universe_domain: process.env.UNIVERSE_DOMAIN,
};
admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
});
const db = admin.firestore();

const app = express();
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: true }));
// Routes
app.use("/users", userRoutes(admin, db));
app.use("/notes", noteRoutes(db));

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
