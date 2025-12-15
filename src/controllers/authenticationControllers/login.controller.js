// src/controllers/authenticationControllers/login.controller.js
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../../config/db.js'; // <-- adjust path if needed

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
const JWT_EXPIRES_IN = '7d';

function createToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /auth/login
export const login = async (req, res) => {
  try {
    console.log('[login] req.body:', req.body);
    console.log('[login] prisma:', !!prisma); // true if prisma exists

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // make sure prisma is defined
    if (!prisma || typeof prisma.user?.findUnique !== 'function') {
      console.error('[login] Prisma client not available or prisma.user.findUnique missing');
      return res.status(500).json({ error: 'Server misconfiguration' });
    }

    // find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    console.log('[login] user from DB:', user);

    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = createToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name ?? null,
        phone_number: user.phone_number ?? null,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('[login] error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
