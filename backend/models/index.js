import { Sequelize } from 'sequelize';
import dbConfig from '../config/database.js';

// Core User/Profile Models
import UserFactory from './user.js';
import childModel from './child.js';
import mascotModel from './mascot.js';
import gradeLevelModel from './gradeLevel.js';
import userPreferenceModel from './userPreference.js';
// Import UserMascotCustomization (CommonJS) dynamically in async init


// Learning Content Models
import subjectModel from './subject.js';
import learningPathModel from './learningPath.js';
import lessonModel from './lesson.js';
import activityModel from './activity.js';

const env = process.env.NODE_ENV || 'development';
const config = dbConfig[env];
const db = {};

const sequelize = new Sequelize(config.url, {
  dialect: config.dialect,
  dialectOptions: config.dialectOptions || {},
  logging: console.log
});

async function initDb() {
  // Initialize models in dependency order (referenced tables first)

  // Core models without dependencies first
  db.GradeLevel = gradeLevelModel(sequelize, Sequelize.DataTypes);
  db.Mascot = mascotModel(sequelize, Sequelize.DataTypes);
  db.Subject = subjectModel(sequelize, Sequelize.DataTypes);

  // Models that depend on the above
  db.User = UserFactory(sequelize, Sequelize.DataTypes);
  db.Child = childModel(sequelize, Sequelize.DataTypes);
  db.UserPreference = userPreferenceModel(sequelize, Sequelize.DataTypes);
  db.LearningPath = learningPathModel(sequelize, Sequelize.DataTypes);
  db.Lesson = lessonModel(sequelize, Sequelize.DataTypes);
  db.Activity = activityModel(sequelize, Sequelize.DataTypes);

  // Models with multiple dependencies last
  // Dynamically import CommonJS UserMascotCustomization
  const userMascotCustomizationImport = await import('./userMascotCustomization.js');
  db.UserMascotCustomization = (userMascotCustomizationImport.default || userMascotCustomizationImport)(sequelize, Sequelize.DataTypes);

  // Set up associations
  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
}

const dbPromise = initDb();
export default dbPromise;
