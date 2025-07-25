import dbPromise from '../models/index.js';

/**
 * @desc Create a new child profile
 * @route POST /api/children
 * @access Private (Parent only)
 */
export const createChild = async (req, res, next) => {
  try {
    console.log('=== CREATE CHILD ENDPOINT HIT ===');
    console.log('Request body:', req.body);

    const db = await dbPromise;
    const { Child, Mascot } = db;

    const { name, pin, age, grade_level } = req.body;
    const parentId = req.user.id;

    // Validate required fields
    if (!name || !pin) {
      return res.status(400).json({
        success: false,
        message: 'Name and PIN are required'
      });
    }

    if (pin.length !== 4 || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({
        success: false,
        message: 'PIN must be exactly 4 digits'
      });
    }

    // Create child in the Child model
    const child = await Child.create({
      name,
      age: age || null,
      grade_level: grade_level || null,
      parent_id: parentId,
      pin, // Will be hashed by model hook
      current_points: 0,
    });

    console.log('Child created successfully:', child.id);

    res.status(201).json({
      success: true,
      child: {
        id: child.id,
        name: child.name,
        age: child.age,
        grade_level: child.grade_level,
        current_points: child.current_points
      }
    });
  } catch (error) {
    console.error('Error creating child:', error);
    next(error);
  }
};

/**
 * @desc Get all children for the logged-in parent
 * @route GET /api/children
 * @access Private (Parent only)
 */
export const getChildren = async (req, res) => {
  try {
    const db = await dbPromise;
    const { Child } = db;

    const children = await Child.findAll({
      where: {
        parent_id: req.user.id
      },
      attributes: ['id', 'name', 'age', 'grade_level', 'current_points', 'selected_mascot_id', 'createdAt']
    });
    res.json({ children });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get a specific child by ID
 * @route GET /api/children/:childId
 * @access Private (Parent only or child themselves)
 */
export const getChildById = async (req, res) => {
  try {
    const { childId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    let whereClause = { id: childId };

    // If user is a parent, ensure they can only access their own children
    if (userRole === 'parent') {
      whereClause.parent_id = userId;
    } else if (userRole === 'child') {
      // If user is a child, ensure they can only access their own profile
      whereClause.id = userId;
    }

    const child = await Child.findOne({
      where: whereClause,
      attributes: ['id', 'name', 'age', 'grade_level', 'current_points', 'selected_mascot_id', 'createdAt']
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    res.json({ child });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Update a child's profile
 * @route PUT /api/children/:childId
 * @access Private (Parent only)
 */
export const updateChild = async (req, res, next) => {
  try {
    const db = await dbPromise;
    const { Child, Mascot } = db;

    const { childId } = req.params;
    const { name, age, grade_level, selected_mascot_id } = req.body;

    const child = await Child.findOne({
      where: {
        id: childId,
        parent_id: req.user.id // Parent authorization
      }
    });

    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found or not authorized' });
    }

    // If selected_mascot_id is provided, validate it
    if (selected_mascot_id) {
      const mascotExists = await Mascot.findByPk(selected_mascot_id);
      if (!mascotExists) {
        return res.status(400).json({ success: false, message: 'Invalid mascot selected' });
      }
    }

    await child.update({
      name: name || child.name,
      age: age || child.age,
      grade_level: grade_level || child.grade_level,
      selected_mascot_id: selected_mascot_id || child.selected_mascot_id,
    });

    res.status(200).json({ success: true, data: child });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Set or reset a child's PIN
 * @route PUT /api/children/:childId/pin
 * @access Private (Parent only)
 */
export const updateChildPin = async (req, res, next) => {
  try {
    const db = await dbPromise;
    const { Child } = db;

    const { childId } = req.params;
    const { pin } = req.body;

    if (!pin || !/^\d{4}$/.test(pin)) {
      return res.status(400).json({ success: false, message: 'PIN must be exactly 4 digits' });
    }

    const child = await Child.findOne({
      where: {
        id: childId,
        parent_id: req.user.id // Parent authorization
      }
    });

    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found or not authorized' });
    }

    // The 'set' function in the model will automatically hash the new PIN
    child.pin = pin;
    await child.save();

    res.status(200).json({ success: true, message: "Child's PIN updated successfully." });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a child's profile
 * @route DELETE /api/children/:childId
 * @access Private (Parent only)
 */
export const deleteChild = async (req, res) => {
  try {
    const db = await dbPromise;
    const { Child } = db;

    const { childId } = req.params;
    const parentId = req.user.id;

    const child = await Child.findOne({
      where: {
        id: childId,
        parent_id: parentId
      }
    });

    if (!child) {
      return res.status(404).json({ error: 'Child not found' });
    }

    await child.destroy();

    res.json({ success: true, message: 'Child deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Get all children for selection (public access)
 * @route GET /api/children/selection
 * @access Public
 */
export const getChildrenForSelection = async (req, res) => {
  try {
    console.log('=== CHILDREN SELECTION ENDPOINT HIT ===');

    const db = await dbPromise;
    const { Child } = db;

    const children = await Child.findAll({
      attributes: ['id', 'name', 'age', 'grade_level'],
      raw: true // Get plain objects instead of Sequelize instances
    });

    console.log('Raw query result:', children);
    console.log('Found children for selection:', children.length);

    res.status(200).json({
      success: true,
      children: children,
      count: children.length
    });
  } catch (error) {
    console.error('Error fetching children for selection:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
};
