const express = require('express');
const { body, validationResult } = require('express-validator');
const Reminder = require('../models/Reminder');
const { protect } = require('../middleware/auth');

const router = express.Router();

// @desc    Create medicine reminder
// @route   POST /api/reminders
// @access  Private
router.post('/', [
  protect,
  body('title').notEmpty().withMessage('Title is required'),
  body('medicineName').notEmpty().withMessage('Medicine name is required'),
  body('dosage').notEmpty().withMessage('Dosage is required'),
  body('frequency').notEmpty().withMessage('Frequency is required'),
  body('startDate').isISO8601().withMessage('Valid start date is required'),
  body('endDate').isISO8601().withMessage('Valid end date is required'),
  body('reminderTimes').isArray({ min: 1 }).withMessage('At least one reminder time is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    const {
      title,
      medicineName,
      dosage,
      frequency,
      instructions,
      reminderTimes,
      startDate,
      endDate,
      expiryDate,
      relatedPrescription,
      notificationType
    } = req.body;

    // Validate dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (start >= end) {
      return res.status(400).json({
        success: false,
        message: 'End date must be after start date'
      });
    }

    const reminder = await Reminder.create({
      user: req.user.id,
      title,
      medicineDetails: {
        name: medicineName,
        dosage,
        frequency,
        instructions
      },
      reminderTimes: reminderTimes.map(time => new Date(time)),
      startDate: start,
      endDate: end,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      relatedPrescription,
      notificationType: notificationType || 'email'
    });

    res.status(201).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get all reminders for user
// @route   GET /api/reminders
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const { active, upcoming } = req.query;
    
    let query = { user: req.user.id };
    
    // Filter by active status if provided
    if (active !== undefined) {
      query.active = active === 'true';
    }
    
    // Filter upcoming reminders (next 7 days)
    if (upcoming === 'true') {
      const today = new Date();
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      query.startDate = { $lte: nextWeek };
      query.endDate = { $gte: today };
    }

    const reminders = await Reminder.find(query)
      .populate('relatedPrescription', 'title recordType')
      .sort({ startDate: 1 });

    res.status(200).json({
      success: true,
      count: reminders.length,
      data: reminders
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Get single reminder
// @route   GET /api/reminders/:id
// @access  Private
router.get('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id)
      .populate('relatedPrescription', 'title recordType fileUrl');

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Make sure user owns the reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this reminder'
      });
    }

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Update reminder
// @route   PUT /api/reminders/:id
// @access  Private
router.put('/:id', [
  protect,
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('startDate').optional().isISO8601().withMessage('Valid start date is required'),
  body('endDate').optional().isISO8601().withMessage('Valid end date is required')
], async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Make sure user owns the reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this reminder'
      });
    }

    const updateFields = { ...req.body };
    
    // Update medicine details if provided
    if (req.body.medicineName || req.body.dosage || req.body.frequency || req.body.instructions) {
      updateFields.medicineDetails = {
        name: req.body.medicineName || reminder.medicineDetails.name,
        dosage: req.body.dosage || reminder.medicineDetails.dosage,
        frequency: req.body.frequency || reminder.medicineDetails.frequency,
        instructions: req.body.instructions || reminder.medicineDetails.instructions
      };
    }

    // Convert reminder times to dates if provided
    if (req.body.reminderTimes) {
      updateFields.reminderTimes = req.body.reminderTimes.map(time => new Date(time));
    }

    reminder = await Reminder.findByIdAndUpdate(req.params.id, updateFields, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Toggle reminder active status
// @route   PUT /api/reminders/:id/toggle
// @access  Private
router.put('/:id/toggle', protect, async (req, res) => {
  try {
    let reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Make sure user owns the reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to update this reminder'
      });
    }

    reminder.active = !reminder.active;
    await reminder.save();

    res.status(200).json({
      success: true,
      data: reminder
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @desc    Delete reminder
// @route   DELETE /api/reminders/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const reminder = await Reminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({
        success: false,
        message: 'Reminder not found'
      });
    }

    // Make sure user owns the reminder
    if (reminder.user.toString() !== req.user.id) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to delete this reminder'
      });
    }

    await Reminder.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Reminder deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;