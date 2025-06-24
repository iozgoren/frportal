
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs').promises;
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../uploads');
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 100 * 1024 * 1024 // 100MB default
  },
  fileFilter: (req, file, cb) => {
    // Allow all file types for now
    cb(null, true);
  }
});

// Get all assets
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      search = '', 
      type = '', 
      folder_id = '', 
      brand_id = '' 
    } = req.query;
    
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    let params = [];

    // Non-admin users can only see assets from their brand
    if (req.user.role !== 'admin' && req.user.brand_id) {
      whereClause += ' AND (a.brand_id = ? OR a.user_id = ?)';
      params.push(req.user.brand_id, req.user.id);
    }

    if (search) {
      whereClause += ' AND (a.name LIKE ? OR a.description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (type) {
      whereClause += ' AND a.file_type = ?';
      params.push(type);
    }

    if (folder_id) {
      whereClause += ' AND a.folder_id = ?';
      params.push(folder_id);
    }

    if (brand_id) {
      whereClause += ' AND a.brand_id = ?';
      params.push(brand_id);
    }

    const [assets] = await db.execute(
      `SELECT a.*, u.name as user_name, b.name as brand_name, f.name as folder_name
       FROM assets a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN brands b ON a.brand_id = b.id
       LEFT JOIN folders f ON a.folder_id = f.id
       WHERE ${whereClause} AND a.status = 'active'
       ORDER BY a.created_at DESC
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [totalResult] = await db.execute(
      `SELECT COUNT(*) as total FROM assets a WHERE ${whereClause} AND a.status = 'active'`,
      params
    );

    res.json({
      assets,
      pagination: {
        total: totalResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get assets error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get asset by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [assets] = await db.execute(
      `SELECT a.*, u.name as user_name, b.name as brand_name, f.name as folder_name
       FROM assets a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN brands b ON a.brand_id = b.id
       LEFT JOIN folders f ON a.folder_id = f.id
       WHERE a.id = ? AND a.status = 'active'`,
      [id]
    );

    if (assets.length === 0) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    const asset = assets[0];

    // Check permissions
    if (req.user.role !== 'admin' && 
        asset.user_id !== req.user.id && 
        asset.brand_id !== req.user.brand_id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    res.json({ asset });
  } catch (error) {
    console.error('Get asset error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Upload asset
router.post('/', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const { name, description, folder_id, brand_id, tags } = req.body;

    // Determine file type based on mime type
    let fileType = 'other';
    if (req.file.mimetype.startsWith('image/')) fileType = 'image';
    else if (req.file.mimetype.startsWith('video/')) fileType = 'video';
    else if (req.file.mimetype.startsWith('audio/')) fileType = 'audio';
    else if (req.file.mimetype.includes('pdf') || 
             req.file.mimetype.includes('document') ||
             req.file.mimetype.includes('spreadsheet') ||
             req.file.mimetype.includes('presentation')) fileType = 'document';

    // Parse tags if provided
    let parsedTags = null;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
      } catch (e) {
        parsedTags = tags.split(',').map(tag => tag.trim());
      }
    }

    const [result] = await db.execute(
      `INSERT INTO assets (name, description, file_path, file_name, file_size, file_type, mime_type, 
       folder_id, brand_id, user_id, tags, created_at, updated_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        name || req.file.originalname,
        description || '',
        req.file.path,
        req.file.filename,
        req.file.size,
        fileType,
        req.file.mimetype,
        folder_id || null,
        brand_id || req.user.brand_id,
        req.user.id,
        JSON.stringify(parsedTags)
      ]
    );

    // Get the created asset
    const [assets] = await db.execute(
      'SELECT * FROM assets WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Asset uploaded successfully.',
      asset: assets[0]
    });
  } catch (error) {
    console.error('Upload asset error:', error);
    
    // Clean up uploaded file if database insert failed
    if (req.file) {
      try {
        await fs.unlink(req.file.path);
      } catch (unlinkError) {
        console.error('Failed to delete uploaded file:', unlinkError);
      }
    }
    
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update asset
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, folder_id, brand_id, tags } = req.body;

    // Check if asset exists and user has permission
    const [assets] = await db.execute(
      'SELECT * FROM assets WHERE id = ? AND status = "active"',
      [id]
    );

    if (assets.length === 0) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    const asset = assets[0];

    if (req.user.role !== 'admin' && asset.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Parse tags if provided
    let parsedTags = asset.tags;
    if (tags !== undefined) {
      if (tags) {
        try {
          parsedTags = JSON.parse(tags);
        } catch (e) {
          parsedTags = tags.split(',').map(tag => tag.trim());
        }
      } else {
        parsedTags = null;
      }
    }

    const [result] = await db.execute(
      `UPDATE assets SET name = ?, description = ?, folder_id = ?, brand_id = ?, tags = ?, updated_at = NOW()
       WHERE id = ?`,
      [
        name !== undefined ? name : asset.name,
        description !== undefined ? description : asset.description,
        folder_id !== undefined ? folder_id : asset.folder_id,
        brand_id !== undefined ? brand_id : asset.brand_id,
        JSON.stringify(parsedTags),
        id
      ]
    );

    // Get updated asset
    const [updatedAssets] = await db.execute(
      `SELECT a.*, u.name as user_name, b.name as brand_name, f.name as folder_name
       FROM assets a
       LEFT JOIN users u ON a.user_id = u.id
       LEFT JOIN brands b ON a.brand_id = b.id
       LEFT JOIN folders f ON a.folder_id = f.id
       WHERE a.id = ?`,
      [id]
    );

    res.json({
      message: 'Asset updated successfully.',
      asset: updatedAssets[0]
    });
  } catch (error) {
    console.error('Update asset error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete asset
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if asset exists and user has permission
    const [assets] = await db.execute(
      'SELECT * FROM assets WHERE id = ? AND status = "active"',
      [id]
    );

    if (assets.length === 0) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    const asset = assets[0];

    if (req.user.role !== 'admin' && asset.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    // Soft delete - mark as archived
    await db.execute(
      'UPDATE assets SET status = "archived", updated_at = NOW() WHERE id = ?',
      [id]
    );

    res.json({ message: 'Asset deleted successfully.' });
  } catch (error) {
    console.error('Delete asset error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Share asset
router.post('/:id/share', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { shareType, sharedWith, expiresAt, permissions } = req.body;

    // Check if asset exists and user has permission
    const [assets] = await db.execute(
      'SELECT * FROM assets WHERE id = ? AND status = "active"',
      [id]
    );

    if (assets.length === 0) {
      return res.status(404).json({ message: 'Asset not found.' });
    }

    const asset = assets[0];

    if (req.user.role !== 'admin' && asset.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Access denied.' });
    }

    let shareToken = null;
    if (shareType === 'link') {
      shareToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    }

    const [result] = await db.execute(
      `INSERT INTO asset_shares (asset_id, shared_by, shared_with, share_type, share_token, expires_at, permissions, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        id,
        req.user.id,
        sharedWith || null,
        shareType,
        shareToken,
        expiresAt || null,
        JSON.stringify(permissions || {})
      ]
    );

    const [shares] = await db.execute(
      'SELECT * FROM asset_shares WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Asset shared successfully.',
      share: shares[0]
    });
  } catch (error) {
    console.error('Share asset error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
