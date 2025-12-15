// src/config/db.js
import pkg from '@prisma/client';

const { PrismaClient } = pkg;

export const prisma = new PrismaClient();
