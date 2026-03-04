import { Router, Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server.js';

const router = Router();

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            res.status(400).json({ error: 'Usuario y contraseña requeridos' });
            return;
        }

        const admin = await prisma.admin.findUnique({ where: { username } });

        if (!admin) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        const valid = await bcrypt.compare(password, admin.passwordHash);

        if (!valid) {
            res.status(401).json({ error: 'Credenciales inválidas' });
            return;
        }

        const token = jwt.sign(
            { id: admin.id },
            process.env.JWT_SECRET || 'fallback-secret',
            { expiresIn: '24h' }
        );

        res.json({ token, admin: { id: admin.id, username: admin.username } });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
});

// POST /api/auth/verify — check if token is still valid
router.post('/verify', async (req: Request, res: Response): Promise<void> => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader?.startsWith('Bearer ')) {
            res.status(401).json({ valid: false });
            return;
        }
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as { id: string };
        const admin = await prisma.admin.findUnique({ where: { id: decoded.id } });
        if (!admin) {
            res.status(401).json({ valid: false });
            return;
        }
        res.json({ valid: true, admin: { id: admin.id, username: admin.username } });
    } catch {
        res.status(401).json({ valid: false });
    }
});

export default router;
