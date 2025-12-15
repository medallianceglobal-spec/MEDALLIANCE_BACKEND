import { prisma } from "../../config/db.js";
import bcrypt from 'bcrypt'
import createToken from "../../utils/jwt.helper.js";


export const signup = async (req, res) => {
  try {
    const { email, password, name, phone_number } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return res.status(409).json({ error: 'Email is already registered' });
    }

    // let parsedPhone = null;
    // if (phone_number !== undefined && phone_number !== null && phone_number !== '') {
    //   parsedPhone = Number(phone_number);
    //   if (Number.isNaN(parsedPhone)) {
    //     return res.status(400).json({ error: 'Phone Number must be a number' });
    //   }
    // }

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        phone_number, // 👈 key is Prisma field name
        passwordHash: hash,
        name: name || null,
        role: 1,
        provider: 'local',
      },
    });

    const token = createToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone_number: user.phone_number,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Signup error:', err);
    if (err.code === 'P2002' && err.meta?.target?.includes('phone_number')) {
      return res.status(409).json({ error: 'Phone number already in use' });
    }
    return res.status(500).json({ error: 'Internal server error' });
  }
};
