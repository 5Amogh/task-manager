const express = require('express');
const Joi = require('joi');

const { validateBody, checkIfIdIsValid , validateStatusParam } = require('../middleware/validator');
const { createTask, getAllTasks, getTaskById, findByIdAndUpdate, getTasksByStatus, markTaskComplete, deleteTaskById } = require('../controllers/taskController');

const router = express.Router();

const createTaskSchema = Joi.object({
  title: Joi.string().min(1).max(200).required(),
  description: Joi.string().trim().allow('').max(2000),
  status: Joi.string().valid('pending', 'in-progress', 'completed', 'cancelled').optional(),
  dueDate: Joi.date().iso().optional().allow(null),
  userId: Joi.string().optional().allow(null, ''),
});

const updateTaskSchema = Joi.object({
    title: Joi.string().min(1).max(200),
    description: Joi.string().trim().allow('').max(2000),
    status: Joi.string().valid('pending', 'in-progress', 'completed', 'cancelled'),
    dueDate: Joi.date().iso().optional().allow(null),
    id: Joi.forbidden(),
    _id: Joi.forbidden(),
    createdAt: Joi.forbidden(),
    updatedAt: Joi.forbidden()
}).min(1);

router.post('/', validateBody(createTaskSchema), createTask);

router.get('/', getAllTasks);

router.get('/:id', checkIfIdIsValid, getTaskById);

router.delete('/:id', checkIfIdIsValid, deleteTaskById);

router.patch('/:id', validateBody(updateTaskSchema), checkIfIdIsValid , findByIdAndUpdate)

router.get('/status/:status', validateStatusParam, getTasksByStatus);

router.put('/:id/complete', checkIfIdIsValid , markTaskComplete);

module.exports = router;