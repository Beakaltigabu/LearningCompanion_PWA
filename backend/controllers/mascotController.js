import dbPromise from '../models/index.js';

export const getAllMascots = async (req, res, next) => {
  try {
    const db = await dbPromise;
    const { Mascot } = db;

    const mascots = await Mascot.findAll({
      order: [['name_en', 'ASC']],
    });

    res.status(200).json({
      success: true,
      count: mascots.length,
      data: mascots,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get a single mascot by ID
 * @route GET /api/mascots/:id
 * @access Public
 */
export const getMascotById = async (req, res, next) => {
  try {
    const db = await dbPromise;
    const { Mascot } = db;

    const { id } = req.params;
    const mascot = await Mascot.findByPk(id);

    if (!mascot) {
      return res.status(404).json({ success: false, message: 'Mascot not found' });
    }

    res.status(200).json({ success: true, data: mascot });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Create a new mascot
 * @route POST /api/mascots
 * @access Private/Admin
 */
export const createMascot = async (req, res, next) => {
  try {
    const db = await dbPromise;
    const { Mascot } = db;

    const { name, image_url, unlock_cost_points, unlock_achievement_id, customizable_options } = req.body;
    const mascot = await Mascot.create({
      name,
      image_url,
      unlock_cost_points,
      unlock_achievement_id,
      customizable_options: customizable_options ? JSON.parse(customizable_options) : undefined,
    });

    res.status(201).json({ success: true, data: mascot });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Update a mascot
 * @route PUT /api/mascots/:id
 * @access Private/Admin
 */
export const updateMascot = async (req, res, next) => {
  try {
    const db = await dbPromise;
    const { Mascot } = db;

    const { id } = req.params;
    let mascot = await Mascot.findByPk(id);

    if (!mascot) {
      return res.status(404).json({ success: false, message: 'Mascot not found' });
    }

    let imageUrl = mascot.image_url;
    // If a new file is uploaded, delete the old one and upload the new one
    if (req.file) {
      await deleteFile(mascot.image_url);
      imageUrl = await uploadFile(req.file);
    }

    const { name, image_url, unlock_cost_points, unlock_achievement_id, customizable_options } = req.body;

    await mascot.update({
      name: name || mascot.name,
      image_url: imageUrl,
      unlock_cost_points: unlock_cost_points || mascot.unlock_cost_points,
      unlock_achievement_id: unlock_achievement_id || mascot.unlock_achievement_id,
      customizable_options: customizable_options ? JSON.parse(customizable_options) : mascot.customizable_options,
    });

    res.status(200).json({ success: true, data: mascot });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Delete a mascot
 * @route DELETE /api/mascots/:id
 * @access Private/Admin
 */
export const deleteMascot = async (req, res, next) => {
  try {
    const db = await dbPromise;
    const { Mascot } = db;

    const { id } = req.params;
    const mascot = await Mascot.findByPk(id);

    if (!mascot) {
      return res.status(404).json({ success: false, message: 'Mascot not found' });
    }

    // Delete the image from Supabase Storage
    await deleteFile(mascot.image_url);

    // Delete the mascot from the database
    await mascot.destroy();

    res.status(200).json({ success: true, message: 'Mascot deleted successfully' });
  } catch (error) {
    next(error);
  }
};
