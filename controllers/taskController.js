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

async function getTasksByStatus(req, res, next) {
  try {
    const { status } = req.params;
    const items = await Task.find({ status }).sort({ createdAt: -1 }).lean();
    return res.status(200).json({
      data: items,
      meta: { totalItems: items.length }
    });
  } catch (err) {
    next(err);
  }
}

async function markTaskComplete(req, res, next) {
  try {
    const { id } = req.params;

    const filter = { _id: id, status: { $ne: 'completed' } };

    const update = {
      $set: {
        status: 'completed'
      }
    };

    const options = { new: true, runValidators: true, context: 'query' };

    const updated = await Task.findOneAndUpdate(filter, update, options).lean();

    if (updated) {
      return res.status(200).json({ data: updated });
    }

    const existing = await Task.findById(id).lean();
    if (!existing) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (existing.status === 'completed') {
      return res.status(200).json({ data: existing, message: 'Task already completed' });
    }

    return res.status(409).json({ error: 'Unable to mark task complete' });
  } catch (err) {
    next(err);
  }
}

async function deleteTaskById(req, res, next) {
  try {
    const { id } = req.params;

    const task = await Task.findByIdAndDelete(id);

    if (!task) {
      return res.status(404).json({ error: 'task not found' });
    }

    return res.status(200).json({ message: 'Task has been deleted successfully' })

  } catch (err) {
    next(err)
  }
}


module.exports = { createTask, getAllTasks, getTaskById, findByIdAndUpdate, getTasksByStatus, markTaskComplete, deleteTaskById };