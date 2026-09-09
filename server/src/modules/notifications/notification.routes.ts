import { Router } from 'express';
import { listNotifications, unreadCount, markRead, markAllRead, deleteNotification } from './notification.controller';
import { authenticate } from '../../core/middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', listNotifications);
router.get('/unread-count', unreadCount);
router.post('/read-all', markAllRead);
router.patch('/:id/read', markRead);
router.delete('/:id', deleteNotification);

export default router;
