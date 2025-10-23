const express = require('express');
const Joi = require('joi');

const { validateBody, checkIfTaskExists } = require('../middleware/validator');
const { createTask, getAllTasks, getTaskById, findByIdAndUpdate} = require('../controllers/taskController');

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

router.get('/:id', checkIfTaskExists, getTaskById);

router.patch('/:id',validateBody(updateTaskSchema),checkIfTaskExists,findByIdAndUpdate)

module.exports = router;