import db from '../models/index.js';
const { User } = db;

/**
 * @desc Get current user's preferences
 * @route GET /api/users/me/preferences
 * @access Private
 */
export const getPreferences = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({
      theme: user.theme_preference,
      language: user.language_preference,
      notifications: user.notification_preferences,
      aiSettings: user.ai_settings
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * @desc Update current user's preferences
 * @route PUT /api/users/me/preferences
 * @access Private
 */
export const updatePreferences = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const { theme, language, notifications, aiSettings } = req.body;
    if (theme) user.theme_preference = theme;
    if (language) user.language_preference = language;
    if (notifications) user.notification_preferences = notifications;
    if (aiSettings) user.ai_settings = aiSettings;
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
