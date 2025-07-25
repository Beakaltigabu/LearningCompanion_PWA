import db from '../models/index.js';
const { User, Child } = db;

export const migrateChildrenToUsers = async () => {
  const transaction = await db.sequelize.transaction();
  
  try {
    // Get all children from Child table
    const children = await Child.findAll({ transaction });
    
    for (const child of children) {
      // Create child user record
      await User.create({
        name: child.name,
        role: 'child',
        parent_id: child.parentId,
        child_pin_hash: child.pin, // Already hashed
        current_points: 0,
        selected_mascot_id: child.mascotId,
      }, { transaction });
    }
    
    await transaction.commit();
    console.log('Migration completed successfully');
  } catch (error) {
    await transaction.rollback();
    console.error('Migration failed:', error);
  }
};