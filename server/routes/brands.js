
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const db = require('../config/database');
const { authMiddleware, adminMiddleware } = require('../middleware/auth');

const router = express.Router();

// Configure multer for logo uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/brands';
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'brand-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Get all brands
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { page = 1, limit = 10, search = '', status = '' } = req.query;
    const offset = (page - 1) * limit;

    let whereClause = '1=1';
    let params = [];

    if (search) {
      whereClause += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    if (status) {
      whereClause += ' AND status = ?';
      params.push(status);
    }

    const [brands] = await db.execute(
      `SELECT * FROM brands 
       WHERE ${whereClause} 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [...params, parseInt(limit), parseInt(offset)]
    );

    const [totalResult] = await db.execute(
      `SELECT COUNT(*) as total FROM brands WHERE ${whereClause}`,
      params
    );

    res.json({
      brands,
      pagination: {
        total: totalResult[0].total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(totalResult[0].total / limit)
      }
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Get brand by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const [brands] = await db.execute(
      'SELECT * FROM brands WHERE id = ?',
      [id]
    );

    if (brands.length === 0) {
      return res.status(404).json({ message: 'Brand not found.' });
    }

    res.json({ brand: brands[0] });
  } catch (error) {
    console.error('Get brand error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Create brand (admin only)
router.post('/', authMiddleware, adminMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { name, description, status = 'active' } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required.' });
    }

    // Check if brand already exists
    const [existingBrands] = await db.execute(
      'SELECT id FROM brands WHERE name = ?',
      [name]
    );

    if (existingBrands.length > 0) {
      return res.status(400).json({ message: 'Brand with this name already exists.' });
    }

    const logo_url = req.file ? `/uploads/brands/${req.file.filename}` : null;

    // Create brand
    const [result] = await db.execute(
      'INSERT INTO brands (name, description, logo_url, status, created_at, updated_at) VALUES (?, ?, ?, ?, NOW(), NOW())',
      [name, description, logo_url, status]
    );

    // Get created brand
    const [newBrand] = await db.execute(
      'SELECT * FROM brands WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({
      message: 'Brand created successfully.',
      brand: newBrand[0]
    });
  } catch (error) {
    console.error('Create brand error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Update brand (admin only)
router.put('/:id', authMiddleware, adminMiddleware, upload.single('logo'), async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, status } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'Brand name is required.' });
    }

    // Check if brand exists
    const [brands] = await db.execute(
      'SELECT * FROM brands WHERE id = ?',
      [id]
    );

    if (brands.length === 0) {
      return res.status(404).json({ message: 'Brand not found.' });
    }

    // Check if name already exists (excluding current brand)
    const [existingBrands] = await db.execute(
      'SELECT id FROM brands WHERE name = ? AND id != ?',
      [name, id]
    );

    if (existingBrands.length > 0) {
      return res.status(400).json({ message: 'Brand with this name already exists.' });
    }

    let logo_url = brands[0].logo_url;

    // If new logo is uploaded, delete old one and use new one
    if (req.file) {
      if (logo_url && fs.existsSync(path.join('uploads/brands', path.basename(logo_url)))) {
        fs.unlinkSync(path.join('uploads/brands', path.basename(logo_url)));
      }
      logo_url = `/uploads/brands/${req.file.filename}`;
    }

    await db.execute(
      'UPDATE brands SET name = ?, description = ?, logo_url = ?, status = ?, updated_at = NOW() WHERE id = ?',
      [name, description, logo_url, status, id]
    );

    // Get updated brand
    const [updatedBrand] = await db.execute(
      'SELECT * FROM brands WHERE id = ?',
      [id]
    );

    res.json({
      message: 'Brand updated successfully.',
      brand: updatedBrand[0]
    });
  } catch (error) {
    console.error('Update brand error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

// Delete brand (admin only)
router.delete('/:id', authMiddleware, adminMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    // Get brand to delete logo file
    const [brands] = await db.execute(
      'SELECT logo_url FROM brands WHERE id = ?',
      [id]
    );

    if (brands.length === 0) {
      return res.status(404).json({ message: 'Brand not found.' });
    }

    // Check if brand has associated users or folders
    const [users] = await db.execute(
      'SELECT id FROM users WHERE brand_id = ?',
      [id]
    );

    const [folders] = await db.execute(
      'SELECT id FROM folders WHERE brand_id = ?',
      [id]
    );

    if (users.length > 0 || folders.length > 0) {
      return res.status(400).json({ 
        message: 'Cannot delete brand that has associated users or folders.' 
      });
    }

    const [result] = await db.execute('DELETE FROM brands WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Brand not found.' });
    }

    // Delete logo file if exists
    if (brands[0].logo_url) {
      const logoPath = path.join('uploads/brands', path.basename(brands[0].logo_url));
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
    }

    res.json({ message: 'Brand deleted successfully.' });
  } catch (error) {
    console.error('Delete brand error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
