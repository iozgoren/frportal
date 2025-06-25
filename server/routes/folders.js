
const express = require('express');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Get all folders for current user
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { brand_id, parent_id } = req.query;
    
    let whereClause = 'user_id = ?';
    let params = [req.user.id];

    if (brand_id) {
      whereClause += ' AND brand_id = ?';
      params.push(brand_id);
    }

    if (parent_id) {
      whereClause += ' AND parent_id = ?';
      params.push(parent_id);
    } else {
      whereClause += ' AND parent_id IS NULL';
    }

    const [folders] = await db.execute(
      `SELECT f.*, b.name as brand_name 
       FROM folders f 
       LEFT JOIN brands b ON f.brand_id = b.id 
       WHERE ${whereClause} 
       ORDER BY f.created_at DESC`,
      params
    );

    res.json({ folders });
  } catch (error) {
    console.error('Get folders error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get folder by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [folders] = await db.execute(
      `SELECT f.*, b.name as brand_name 
       FROM folders f 
       LEFT JOIN brands b ON f.brand_id = b.id 
       WHERE f.id = ? AND f.user_id = ?`,
      [id, req.user.id]
    );

    if (folders.length === 0) {
      return res.status(404).json({ message: 'Folder not found.' });
    }

    res.json({ folder: folders[0] });
  } catch (error) {
    console.error('Get folder error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create new folder
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { name, parent_id, brand_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Folder name is required.' });
    }

    // Check if folder with same name exists in same parent
    const [existingFolders] = await db.execute(
      'SELECT id FROM folders WHERE name = ? AND parent_id = ? AND user_id = ?',
      [name, parent_id || null, req.user.id]
    );

    if (existingFolders.length > 0) {
      return res.status(400).json({ message: 'Folder with this name already exists in this location.' });
    }

    const [result] = await db.execute(
      'INSERT INTO folders (name, parent_id, brand_id, user_id, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, parent_id || null, brand_id || null, req.user.id]
    );

    // Get created folder with brand info
    const [newFolder] = await db.execute(
      `SELECT f.*, b.name as brand_name 
       FROM folders f 
       LEFT JOIN brands b ON f.brand_id = b.id 
       WHERE f.id = ?`,
      [result.insertId]
    );

    res.status(201).json({
      message: 'Folder created successfully.',
      folder: newFolder[0]
    });
  } catch (error) {
    console.error('Create folder error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update folder
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parent_id, brand_id } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Folder name is required.' });
    }

    // Check if user owns the folder
    const [folders] = await db.execute(
      'SELECT id FROM folders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (folders.length === 0) {
      return res.status(404).json({ message: 'Folder not found.' });
    }

    // Check if folder with same name exists in same parent (excluding current folder)
    const [existingFolders] = await db.execute(
      'SELECT id FROM folders WHERE name = ? AND parent_id = ? AND user_id = ? AND id != ?',
      [name, parent_id || null, req.user.id, id]
    );

    if (existingFolders.length > 0) {
      return res.status(400).json({ message: 'Folder with this name already exists in this location.' });
    }

    await db.execute(
      'UPDATE folders SET name = ?, parent_id = ?, brand_id = ?, updated_at = NOW() WHERE id = ?',
      [name, parent_id || null, brand_id || null, id]
    );

    // Get updated folder with brand info
    const [updatedFolder] = await db.execute(
      `SELECT f.*, b.name as brand_name 
       FROM folders f 
       LEFT JOIN brands b ON f.brand_id = b.id 
       WHERE f.id = ?`,
      [id]
    );

    res.json({
      message: 'Folder updated successfully.',
      folder: updatedFolder[0]
    });
  } catch (error) {
    console.error('Update folder error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete folder
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if user owns the folder
    const [folders] = await db.execute(
      'SELECT id FROM folders WHERE id = ? AND user_id = ?',
      [id, req.user.id]
    );

    if (folders.length === 0) {
      return res.status(404).json({ message: 'Folder not found.' });
    }

    // Check if folder has subfolders or assets
    const [subfolders] = await db.execute(
      'SELECT id FROM folders WHERE parent_id = ?',
      [id]
    );

    if (subfolders.length > 0) {
      return res.status(400).json({ message: 'Cannot delete folder that contains subfolders.' });
    }

    const [result] = await db.execute('DELETE FROM folders WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Folder not found.' });
    }

    res.json({ message: 'Folder deleted successfully.' });
  } catch (error) {
    console.error('Delete folder error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
