import db from '../models/index.js';
import AppError from '../utils/AppError.js';

const { Subject, GradeLevel, LearningPath } = db;

// @desc    Create a new subject
// @route   POST /api/content/subjects
// @access  Private (Admin)
export const createSubject = async (req, res, next) => {
    try {
        const { name, description, icon_url } = req.body;
        if (!name) {
            return next(new AppError('Subject name is required', 400));
        }
        const newSubject = await Subject.create({ name, description, icon_url });
        res.status(201).json({ success: true, data: newSubject });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all subjects
// @route   GET /api/content/subjects
// @access  Public
export const getAllSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.findAll();
        res.status(200).json({ success: true, count: subjects.length, data: subjects });
    } catch (error) {
        next(error);
    }
};

// @desc    Get a single subject by ID
// @route   GET /api/content/subjects/:id
// @access  Public
export const getSubjectById = async (req, res, next) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) {
            return next(new AppError('Subject not found', 404));
        }
        res.status(200).json({ success: true, data: subject });
    } catch (error) {
        next(error);
    }
};

// @desc    Update a subject
// @route   PUT /api/content/subjects/:id
// @access  Private (Admin)
export const updateSubject = async (req, res, next) => {
    try {
        const subject = await Subject.findByPk(req.params.id);
        if (!subject) {
            return next(new AppError('Subject not found', 404));
        }
        const updatedSubject = await subject.update(req.body);
        res.status(200).json({ success: true, data: updatedSubject });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a subject
// @route   DELETE /api/content/subjects/:id
// @access  Private (Admin)
export const deleteSubject = async (req, res, next) => {
  try {
    const subject = await Subject.findByPk(req.params.id);
    if (!subject) {
      return next(new AppError('No subject found with that ID', 404));
    }
    await subject.destroy();
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};

// GradeLevel Controllers
export const createGradeLevel = async (req, res, next) => {
  try {
    const newGradeLevel = await GradeLevel.create(req.body);
    res.status(201).json({ success: true, data: newGradeLevel });
  } catch (error) {
    next(error);
  }
};

export const getAllGradeLevels = async (req, res, next) => {
  try {
    const gradeLevels = await GradeLevel.findAll();
    res.status(200).json({ success: true, count: gradeLevels.length, data: gradeLevels });
  } catch (error) {
    next(error);
  }
};

export const getGradeLevelById = async (req, res, next) => {
  try {
    const gradeLevel = await GradeLevel.findByPk(req.params.id);
    if (!gradeLevel) {
      return next(new AppError('No grade level found with that ID', 404));
    }
    res.status(200).json({ success: true, data: gradeLevel });
  } catch (error) {
    next(error);
  }
};

export const updateGradeLevel = async (req, res, next) => {
  try {
    const gradeLevel = await GradeLevel.findByPk(req.params.id);
    if (!gradeLevel) {
      return next(new AppError('No grade level found with that ID', 404));
    }
    const updatedGradeLevel = await gradeLevel.update(req.body);
    res.status(200).json({ success: true, data: updatedGradeLevel });
  } catch (error) {
    next(error);
  }
};

export const deleteGradeLevel = async (req, res, next) => {
  try {
    const gradeLevel = await GradeLevel.findByPk(req.params.id);
    if (!gradeLevel) {
      return next(new AppError('No grade level found with that ID', 404));
    }
    await gradeLevel.destroy();
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};

// LearningPath Controllers
export const createLearningPath = async (req, res, next) => {
  try {
    const newLearningPath = await LearningPath.create(req.body);
    res.status(201).json({ success: true, data: newLearningPath });
  } catch (error) {
    next(error);
  }
};

export const getAllLearningPaths = async (req, res, next) => {
  try {
    const learningPaths = await LearningPath.findAll({
      include: [{ model: Subject }, { model: GradeLevel }]
    });
    res.status(200).json({ success: true, count: learningPaths.length, data: learningPaths });
  } catch (error) {
    next(error);
  }
};

export const getLearningPathById = async (req, res, next) => {
  try {
    const learningPath = await LearningPath.findByPk(req.params.id, {
      include: [{ model: Subject }, { model: GradeLevel }]
    });
    if (!learningPath) {
      return next(new AppError('No learning path found with that ID', 404));
    }
    res.status(200).json({ success: true, data: learningPath });
  } catch (error) {
    next(error);
  }
};

export const updateLearningPath = async (req, res, next) => {
  try {
    const learningPath = await LearningPath.findByPk(req.params.id);
    if (!learningPath) {
      return next(new AppError('No learning path found with that ID', 404));
    }
    const updatedLearningPath = await learningPath.update(req.body);
    res.status(200).json({ success: true, data: updatedLearningPath });
  } catch (error) {
    next(error);
  }
};

export const deleteLearningPath = async (req, res, next) => {
  try {
    const learningPath = await LearningPath.findByPk(req.params.id);
    if (!learningPath) {
      return next(new AppError('No learning path found with that ID', 404));
    }
    await learningPath.destroy();
    res.status(204).json({ success: true, data: null });
  } catch (error) {
    next(error);
  }
};
