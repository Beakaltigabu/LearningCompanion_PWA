import db from '../models/index.js';
const { UserMascotCustomization, Child } = db;

/**
 * @desc    Get mascot customization for a specific child
 * @route   GET /api/customizations/:childId
 * @access  Private (Parent or the child themselves)
 */
export const getCustomization = async (req, res, next) => {
  try {
    const { childId } = req.params;
    const loggedInUserId = req.user.id;
    const loggedInUserRole = req.user.role;

    const child = await Child.findByPk(childId);
    if (!child) {
      return res.status(404).json({ success: false, message: 'Child not found' });
    }

    // Authorization check: Allow if the logged-in user is the child or their parent.
    if (loggedInUserRole !== 'parent' || child.parent_id !== loggedInUserId) {
        if (loggedInUserRole !== 'child' || loggedInUserId !== childId) {
            return res.status(403).json({ success: false, message: 'Not authorized to view this customization' });
        }
    }

    const customization = await UserMascotCustomization.findOne({
      where: { user_id: childId },
    });

    if (!customization) {
      return res.status(404).json({ success: false, message: 'No customization found for this child' });
    }

    res.status(200).json({ success: true, data: customization });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Create or update mascot customization for a child
 * @route   POST /api/customizations
 * @access  Private (Child only)
 */
export const upsertCustomization = async (req, res, next) => {
  try {
    const childId = req.user.id; // Children can only update their own customization
    const { mascot_id, custom_settings } = req.body;

    if (!mascot_id || !custom_settings) {
      return res.status(400).json({ success: false, message: 'Mascot ID and custom settings are required' });
    }

    // Find existing customization or build a new one
    let customization = await UserMascotCustomization.findOne({
      where: { user_id: childId },
    });

    if (customization) {
      // Update existing
      customization.mascot_id = mascot_id;
      customization.custom_settings = custom_settings;
      await customization.save();
    } else {
      // Create new
      customization = await UserMascotCustomization.create({
        user_id: childId,
        mascot_id,
        custom_settings,
      });
    }

    res.status(200).json({ success: true, data: customization });
  } catch (error) {
    next(error);
  }
};
