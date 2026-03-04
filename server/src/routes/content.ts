import { Router, Request, Response } from 'express';
import { prisma } from '../server.js';
import { authMiddleware, AuthRequest } from '../middleware/auth.js';

const router = Router();

// GET /api/content — list published content (public)
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { type, limit } = req.query;
        const where: any = { published: true };
        if (type) where.type = (type as string).toUpperCase();

        const content = await prisma.content.findMany({
            where,
            orderBy: { createdAt: 'desc' },
            take: limit ? parseInt(limit as string) : undefined,
            include: { _count: { select: { comments: true } } },
        });

        res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Error al obtener contenido' });
    }
});

// GET /api/content/all — list ALL content (admin)
router.get('/all', authMiddleware, async (_req: AuthRequest, res: Response): Promise<void> => {
    try {
        const content = await prisma.content.findMany({
            orderBy: { createdAt: 'desc' },
            include: { _count: { select: { comments: true } } },
        });
        res.json(content);
    } catch (error) {
        console.error('Error fetching all content:', error);
        res.status(500).json({ error: 'Error al obtener contenido' });
    }
});

// GET /api/content/:id — single content (public, but shows drafts to admin)
router.get('/:id', async (req: Request, res: Response): Promise<void> => {
    try {
        const content = await prisma.content.findUnique({
            where: { id: req.params.id as string },
            include: {
                comments: {
                    where: { parentId: null },
                    orderBy: { createdAt: 'desc' },
                    include: {
                        replies: {
                            orderBy: { createdAt: 'asc' },
                            include: {
                                replies: {
                                    orderBy: { createdAt: 'asc' },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!content) {
            res.status(404).json({ error: 'Contenido no encontrado' });
            return;
        }

        res.json(content);
    } catch (error) {
        console.error('Error fetching content:', error);
        res.status(500).json({ error: 'Error al obtener contenido' });
    }
});

// POST /api/content — create content (admin only)
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, body, type, mediaUrl, thumbnailUrl, published } = req.body;

        if (!title || !description || !type) {
            res.status(400).json({ error: 'Título, descripción y tipo son requeridos' });
            return;
        }

        const content = await prisma.content.create({
            data: {
                title,
                description,
                body: body || null,
                type: type.toUpperCase(),
                mediaUrl: mediaUrl || null,
                thumbnailUrl: thumbnailUrl || null,
                published: published ?? false,
            },
        });

        res.status(201).json(content);
    } catch (error) {
        console.error('Error creating content:', error);
        res.status(500).json({ error: 'Error al crear contenido' });
    }
});

// PUT /api/content/:id — update content (admin only)
router.put('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        const { title, description, body, type, mediaUrl, thumbnailUrl, published } = req.body;

        const content = await prisma.content.update({
            where: { id: req.params.id as string },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(body !== undefined && { body }),
                ...(type !== undefined && { type: type.toUpperCase() }),
                ...(mediaUrl !== undefined && { mediaUrl }),
                ...(thumbnailUrl !== undefined && { thumbnailUrl }),
                ...(published !== undefined && { published }),
            },
        });

        res.json(content);
    } catch (error) {
        console.error('Error updating content:', error);
        res.status(500).json({ error: 'Error al actualizar contenido' });
    }
});

// DELETE /api/content/:id — delete content (admin only)
router.delete('/:id', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
    try {
        await prisma.content.delete({ where: { id: req.params.id as string } });
        res.json({ message: 'Contenido eliminado' });
    } catch (error) {
        console.error('Error deleting content:', error);
        res.status(500).json({ error: 'Error al eliminar contenido' });
    }
});

export default router;
