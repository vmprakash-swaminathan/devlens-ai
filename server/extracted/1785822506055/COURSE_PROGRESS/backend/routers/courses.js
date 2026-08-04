const express = require('express');
const router = express.Router();
const pool = require('../db');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

// Helper: Generate PDF
function generateCertificatePDF(doc, userName, courseTitle) {
  const bgPath = path.join(__dirname, '../assets/certificate_bg.jpeg');

  if (fs.existsSync(bgPath)) {
    doc.image(bgPath, 0, 0, {
      width: doc.page.width,
      height: doc.page.height,
    });
  }

  doc.fillColor('black');
  doc.font('Helvetica-Bold')
     .fontSize(36)
     .text('Certificate of Completion', 0, 160, { align: 'center' });

  doc.moveDown(2);
  doc.font('Helvetica')
     .fontSize(24)
     .text('This is to certify that', { align: 'center' });

  doc.moveDown();
  doc.font('Helvetica-Bold')
     .fontSize(32)
     .fillColor('#003366')
     .text(userName, { align: 'center' });

  doc.moveDown(1);
  doc.font('Helvetica')
     .fontSize(22)
     .fillColor('black')
     .text('has successfully completed the course', { align: 'center' });

  doc.font('Helvetica-Bold')
     .fontSize(28)
     .fillColor('#800000')
     .text(`"${courseTitle}"`, { align: 'center' });
  doc.moveDown(1);
  doc.font('Helvetica-Oblique')
     .fontSize(18)
     .fillColor('gray')
     .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'center' });
}

// ✅ Get all courses with progress
router.get('/user/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
    const result = await pool.query(`
      SELECT 
        c.id, c.title, c.language,
        COUNT(m.id) AS totalModules,
        COUNT(mv.watched) FILTER (WHERE mv.watched = true) AS completedModules
      FROM courses c
      LEFT JOIN modules m ON c.id = m.course_id
      LEFT JOIN module_views mv ON m.id = mv.module_id AND mv.user_id = $1
      GROUP BY c.id
    `, [userId]);

    const courses = result.rows.map(course => {
      const total = parseInt(course.totalmodules);
      const completed = parseInt(course.completedmodules);
      const progress = total === 0 ? 0 : Math.floor((completed / total) * 100);

      return {
        id: course.id,
        title: course.title,
        language: course.language,
        totalModules: total,
        completedModules: completed,
        progress
      };
    });

    res.json(courses);
  } catch (err) {
    console.error('Fetch course error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Get modules for course
router.get('/:courseId/modules/:userId', async (req, res) => {
  const { courseId, userId } = req.params;

  try {
    const result = await pool.query(`
      SELECT 
        m.id, m.title, m.video_url,
        COALESCE(mv.watched, false) AS is_completed
      FROM modules m
      LEFT JOIN module_views mv ON m.id = mv.module_id AND mv.user_id = $1
      WHERE m.course_id = $2
      ORDER BY m.id
    `, [userId, courseId]);

    res.json(result.rows);
  } catch (err) {
    console.error('Fetch modules error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Mark module as complete
router.post('/modules/:moduleId/complete', async (req, res) => {
  const { moduleId } = req.params;
  const { userId } = req.body;

  try {
    await pool.query(`
      INSERT INTO module_views (user_id, module_id, watched)
      VALUES ($1, $2, true)
      ON CONFLICT (user_id, module_id)
      DO UPDATE SET watched = true
    `, [userId, moduleId]);

    res.json({ message: 'Module marked as completed' });
  } catch (err) {
    console.error('Complete module error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Download certificate
router.get('/certificate/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const userResult = await pool.query(`SELECT name FROM users WHERE id = $1`, [userId]);
    const courseResult = await pool.query(`SELECT title FROM courses WHERE id = $1`, [courseId]);

    if (userResult.rowCount === 0 || courseResult.rowCount === 0) {
      return res.status(404).json({ error: 'User or course not found' });
    }

    const progressResult = await pool.query(`
      SELECT COUNT(m.id) AS total,
             COUNT(mv.watched) FILTER (WHERE mv.watched = true) AS completed
      FROM modules m
      LEFT JOIN module_views mv ON m.id = mv.module_id AND mv.user_id = $1
      WHERE m.course_id = $2
    `, [userId, courseId]);

    const total = parseInt(progressResult.rows[0].total);
    const completed = parseInt(progressResult.rows[0].completed);

    if (completed !== total) {
      return res.status(400).json({ error: 'Course not fully completed' });
    }

    const userName = userResult.rows[0].name;
    const courseTitle = courseResult.rows[0].title;

    const fileName = `certificate_${userId}_${courseId}.pdf`;
    const filePath = path.join(__dirname, `../certificates/${fileName}`);

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape' });

    const stream = fs.createWriteStream(filePath);
    doc.pipe(stream);

    generateCertificatePDF(doc, userName, courseTitle);
    doc.end();

    stream.on('finish', () => {
      res.download(filePath);
    });

  } catch (err) {
    console.error('Certificate error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// ✅ Preview certificate (base64)
router.get('/certificate-preview/:userId/:courseId', async (req, res) => {
  const { userId, courseId } = req.params;

  try {
    const userResult = await pool.query(`SELECT name FROM users WHERE id = $1`, [userId]);
    const courseResult = await pool.query(`SELECT title FROM courses WHERE id = $1`, [courseId]);

    if (userResult.rowCount === 0 || courseResult.rowCount === 0) {
      return res.status(404).json({ error: 'User or course not found' });
    }

    const progressResult = await pool.query(`
      SELECT COUNT(m.id) AS total,
             COUNT(mv.watched) FILTER (WHERE mv.watched = true) AS completed
      FROM modules m
      LEFT JOIN module_views mv ON m.id = mv.module_id AND mv.user_id = $1
      WHERE m.course_id = $2
    `, [userId, courseId]);

    const total = parseInt(progressResult.rows[0].total);
    const completed = parseInt(progressResult.rows[0].completed);

    if (completed !== total) {
      return res.status(400).json({ error: 'Course not fully completed' });
    }

    const userName = userResult.rows[0].name;
    const courseTitle = courseResult.rows[0].title;

    const doc = new PDFDocument({ size: 'A4', layout: 'landscape', margin: 0 });

    let chunks = [];
    doc.on('data', (chunk) => chunks.push(chunk));
    doc.on('end', () => {
      const buffer = Buffer.concat(chunks);
      const base64 = buffer.toString('base64');
      res.json({ base64 });
    });

    generateCertificatePDF(doc, userName, courseTitle);
    doc.end();

  } catch (err) {
    console.error('Certificate preview error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
