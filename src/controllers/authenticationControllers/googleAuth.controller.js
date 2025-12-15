import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import {prisma} from "../../config/db.js"; // adjust path

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req, res) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      console.warn("Missing idToken in request body");
      return res.status(400).json({ message: "idToken required in body" });
    }

    // DEBUG: show first 100 chars (never log full token in prod)
    // console.info("Received idToken (truncated):", idToken.slice(0, 100));

    // Try to verify token with Google
    let ticket;
    try {
      ticket = await client.verifyIdToken({
        idToken,
        audience: process.env.GOOGLE_CLIENT_ID, // ensure this env var is exact
      });
    } catch (verifyErr) {
      console.error("Google verifyIdToken failed:", verifyErr?.message || verifyErr);
      // include reason if provided
      return res.status(401).json({
        message: "Invalid or expired Google ID token",
        error: verifyErr?.message || "verification_failed",
      });
    }

    const payload = ticket.getPayload();
    // console.info("Google token payload:", {
    //   sub: payload.sub,
    //   email: payload.email,
    //   email_verified: payload.email_verified,
    //   aud: payload.aud,
    //   exp: payload.exp,
    // });

    // Audience check (extra safety)
    if (payload.aud !== process.env.GOOGLE_CLIENT_ID) {
      console.warn("Audience mismatch", payload.aud, process.env.GOOGLE_CLIENT_ID);
      return res.status(401).json({ message: "Token audience mismatch" });
    }

    // Email verification check (optional)
    if (!payload.email_verified) {
      console.warn("Email not verified by Google for", payload.email);
      // you can still allow or decide to reject:
      return res.status(401).json({ message: "Google account email not verified" });
    }

    const email = payload.email;
    const name = payload.name;
    const picture = payload.picture;
    const googleId = payload.sub;

    // DB: find or create user
    let user = await prisma.user.findUnique({ where: { email } });

    const isNew = !user;
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          googleId,
          avatarUrl: picture,
          provider: "GOOGLE",
          phone_number: "null"
        },
      });
    }

    // generate your JWT as usual
    const token = jwt.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });

    return res.status(200).json({ token, user, isNewUser: isNew });
  } catch (err) {
    console.error("googleAuth general error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};