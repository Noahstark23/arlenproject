import { Router, Request, Response } from 'express';
import { prisma } from '../server.js';

const router = Router();

// GET /api/comments/:contentId — get comments for a content
router.get('/:contentId', async (req: Request, res: Response): Promise<void> => {
    try {
        const { sort } = req.query;
        const orderBy: any = sort === 'likes' ? { likes: 'desc' } : { createdAt: sort === 'oldest' ? 'asc' : 'desc' };

        const comments = await prisma.comment.findMany({
            where: { contentId: req.params.contentId, parentId: null },
            orderBy,
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
        });

        res.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        res.status(500).json({ error: 'Error al obtener comentarios' });
    }
});

// POST /api/comments — create a comment or reply
router.post('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const { contentId, parentId, authorName, body } = req.body;

        if (!contentId || !authorName || !body) {
            res.status(400).json({ error: 'contentId, authorName y body son requeridos' });
            return;
        }

        // Verify content exists
        const content = await prisma.content.findUnique({ where: { id: contentId } });
        if (!content) {
            res.status(404).json({ error: 'Contenido no encontrado' });
            return;
        }

        // If replying, verify parent exists and limit depth to 3 levels
        if (parentId) {
            const parent = await prisma.comment.findUnique({
                where: { id: parentId },
                include: { parent: { include: { parent: true } } },
            });
            if (!parent) {
                res.status(404).json({ error: 'Comentario padre no encontrado' });
                return;
            }
            // Check depth (parent has parent has parent = too deep)
            if (parent.parent?.parentId) {
                res.status(400).json({ error: 'Profundidad máxima de respuestas alcanzada (3 niveles)' });
                return;
            }
        }

        const comment = await prisma.comment.create({
            data: {
                contentId,
                parentId: parentId || null,
                authorName,
                body,
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        console.error('Error creating comment:', error);
        res.status(500).json({ error: 'Error al crear comentario' });
    }
});

// POST /api/comments/:id/like — like a comment
router.post('/:id/like', async (req: Request, res: Response): Promise<void> => {
    try {
        const comment = await prisma.comment.update({
            where: { id: req.params.id },
            data: { likes: { increment: 1 } },
        });

        res.json(comment);
    } catch (error) {
        console.error('Error liking comment:', error);
        res.status(500).json({ error: 'Error al dar like' });
    }
});

export default router;
