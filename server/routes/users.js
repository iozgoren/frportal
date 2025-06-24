
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all users (admin only)
router.get('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', role = '', brand_id = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (username LIKE ? OR email LIKE ? OR name LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (role) {
      whereClause += ' AND role = ?';
      params.push(role);
    }

    if (brand_id) {
      whereClause += ' AND brand_id = ?';
      params.push(brand_id);
    }

    const [users] = await db.execute(
      `SELECT id, username, email, name, role, brand_id, status, avatar_url, created_at, updated_at 
       FROM users 
       WHERE ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [totalResult] = await db.execute(
      `SELECT COUNT(*) as total FROM users WHERE ${whereClause}`,
      params
    );

    res.json({
      users,
      pagination: {
        total: totalResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get user by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only view their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    const [users] = await db.execute(
      'SELECT id, username, email, name, role, brand_id, status, avatar_url, created_at, updated_at FROM users WHERE id = ?',
      [id]
    );

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ user: users[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create user (admin only)
router.post('/', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { username, email, password, name, role = 'user', brand_id, status = 'active' } = req.body;

    if (!username || !email || !password || !name) {
      return res.status(400).json({ message: 'Username, email, password, and name are required.' });
    }

    // Check if user already exists
    const [existingUsers] = await db.execute(
      'SELECT id FROM users WHERE username = ? OR email = ?',
      [username, email]
    );

    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User with this username or email already exists.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const [result] = await db.execute(
      'INSERT INTO users (username, email, password, name, role, brand_id, status, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
      [username, email, hashedPassword, name, role, brand_id, status]
    );

    // Get created user
    const [newUser] = await db.execute(
      'SELECT id, username, email, name, role, brand_id, status, created_at FROM users WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'User created successfully.',
      user: newUser[0]
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update user
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, name, role, brand_id, status } = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Non-admin users can't change role, brand_id, or status
    const allowedFields = req.user.role === 'admin' 
      ? { username, email, name, role, brand_id, status }
      : { username, email, name };

    const fields = Object.keys(allowedFields).filter(key => allowedFields[key] !== undefined);
    const values = fields.map(field => allowedFields[field]);

    if (fields.length === 0) {
      return res.status(400).json({ message: 'No valid fields to update.' });
    }

    // Check if username or email already exists (excluding current user)
    if (username || email) {
      const [existingUsers] = await db.execute(
        'SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?',
        [username || '', email || '', id]
      );

      if (existingUsers.length > 0) {
        return res.status(400).json({ message: 'Username or email already exists.' });
      }
    }

    const setClause = fields.map(field => `${field} = ?`).join(', ');
    values.push(id);

    await db.execute(
      `UPDATE users SET ${setClause}, updated_at = NOW() WHERE id = ?`,
      values
    );

    // Get updated user
    const [updatedUser] = await db.execute(
      'SELECT id, username, email, name, role, brand_id, status, avatar_url, updated_at FROM users WHERE id = ?',
      [id]
    );

    res.json({
      message: 'User updated successfully.',
      user: updatedUser[0]
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete user (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Can't delete yourself
    if (req.user.id === parseInt(id)) {
      return res.status(400).json({ message: 'You cannot delete your own account.' });
    }

    const [result] = await db.execute('DELETE FROM users WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.json({ message: 'User deleted successfully.' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
