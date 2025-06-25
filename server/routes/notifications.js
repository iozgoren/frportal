
const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all notifications for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread_only = false } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = 'user_id = ?';
    let params = [req.user.id];

    if (unread_only === 'true') {
      whereClause += ' AND read_at IS NULL';
    }

    const [notifications] = await db.execute(
      `SELECT * FROM notifications 
       WHERE ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [totalResult] = await db.execute(
      `SELECT COUNT(*) as total FROM notifications WHERE ${whereClause}`,
      params
    );

    const [unreadResult] = await db.execute(
      `SELECT COUNT(*) as unread FROM notifications WHERE user_id = ? AND read_at IS NULL`,
      [req.user.id]
    );

    res.json({
      notifications,
      pagination: {
        total: totalResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalResult[0].total / limit)
      },
      unreadCount: unreadResult[0].unread
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Mark notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if notification belongs to user
    const [notifications] = await db.execute(
      'SELECT id FROM notifications WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (notifications.length === 0) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    const [result] = await db.execute(
      'UPDATE notifications SET read_at = NOW() WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.json({ message: 'Notification marked as read.' });
  } catch (error) {
    console.error('Mark notification read error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Mark all notifications as read
router.put('/mark-all-read', authMiddleware, async (req, res) => {
  try {
    await db.execute(
      'UPDATE notifications SET read_at = NOW() WHERE user_id = ? AND read_at IS NULL',
      [req.user.id]
    );

    res.json({ message: 'All notifications marked as read.' });
  } catch (error) {
    console.error('Mark all notifications read error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create notification (internal use)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { user_id, title, message, type = 'info', data = null } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({ message: 'User ID, title, and message are required.' });
    }

    const [result] = await db.execute(
      'INSERT INTO notifications (user_id, title, message, type, data, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [user_id, title, message, type, JSON.stringify(data)]
    );

    // Get created notification
    const [newNotification] = await db.execute(
      'SELECT * FROM notifications WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Notification created successfully.',
      notification: newNotification[0]
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete notification
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      'DELETE FROM notifications WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found.' });
    }

    res.json({ message: 'Notification deleted successfully.' });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Helper function to create notification (can be used by other routes)
const createNotification = async (userId, title, message, type = 'info', data = null) => {
  try {
    await db.execute(
      'INSERT INTO notifications (user_id, title, message, type, data, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [userId, title, message, type, JSON.stringify(data)]
    );
  } catch (error) {
    console.error('Create notification helper error:', error);
  }
};

module.exports = router;
module.exports.createNotification = createNotification;
