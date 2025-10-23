const Task = require('../models/tasks');

async function createTask(req, res, next) {
  try {
    const payload = req.validatedBody || req.body;

    if (!payload.title) {
      return res.status(400).json({ error: 'title is required' });
    }

    const task = new Task({
      title: payload.title,
      description: payload.description,
      status: payload.status,
      dueDate: payload.dueDate,
      userId: payload.userId,
    });

    const saved = await task.save();

    return res.status(201).json({ data: saved });
  } catch (err) {
    next(err);
  }
}

async function getAllTasks(req, res, next) {
    try {
        const allTasks = await Task.find({}).lean();
        return res.status(200).json({ data: allTasks, meta:{ totalTasks: allTasks.length }})
    } catch (err) {
        next(err)
    }
}


async function getTaskById(req, res, next) {
    try {
        const { id } = req.params;

        const task = await Task.findById(id).lean();
        
        if (!task) {
            return res.status(404).json({ error: 'task not found' });
        }
        
        return res.status(200).json({ data: task })

    } catch (err) {
        next(err)
    }
}

async function findByIdAndUpdate(req, res, next) {
    try {
        const { id } = req.params;

        const update = {
            title: req.body.title,
            description: req.body.description,
            status: req.body.status,
            dueDate: req.body.dueDate
        }

        const filter = { _id: id, status: { $ne: 'completed' } };

        const options = { new : true, runValidators : true, context: 'query'}

        const updatedTask = await Task.findByIdAndUpdate(filter, update, options).lean();

        if (!updatedTask) {
            const task = await Task.findById(id).lean();

            if (!task) {
                return res.status(404).json({ error: 'task not found' });
            } else if(task.status == 'completed'){
                return res.status(400).json({ error: 'task has been completed thus cannot be updated' });
            } else {
                return res.status(409).json({ error: 'task not found' });
            }

        }

        return res.status(200).json({ data : updatedTask})
    } catch (err) {
        next(err)
    }
}
module.exports = { createTask, getAllTasks, getTaskById , findByIdAndUpdate};