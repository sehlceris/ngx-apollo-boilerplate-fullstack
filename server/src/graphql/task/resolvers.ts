let currentId = 2;
let getMockId = function() {
  currentId++;
  return String(currentId);
};
let mockTasks = [
  {
    id: '1',
    userId: '1',
    name: 'Task 1',
    description: 'task 1 description',
    done: false
  },
  {
    id: '2',
    userId: '1',
    name: 'Task 2',
    description: 'task 2 description',
    done: false
  }
];

export const taskResolvers = {
  Query: {
    allTasks(obj, args, context, info) {
      return mockTasks;
    },
    taskById(obj, args, context, info) {
      return mockTasks.find((task) => task.id === args.id);
    },
    taskByUserId(obj, args, context, info) {
      return mockTasks.find((task) => task.id === args.id);
    },
  },
  Mutation: {
    addTask(obj, args, context, info) {
      const newTask = {
        ...args,
        done: false,
        id: getMockId(),
      };
      mockTasks.push(newTask);
      return newTask;
    },
    deleteTaskById(obj, args, context, info) {
      const foundTask = mockTasks.find((task) => task.id === args.id);
      if (foundTask) {
        mockTasks = mockTasks.filter((task) => task.id !== foundTask.id);
        return foundTask;
      }
      return null;
    },
    updateTaskById(obj, args, context, info) {
      const foundTask = mockTasks.find((task) => task.id === args.id);
      if (foundTask) {
        Object.keys(args).forEach((argName) => {
          foundTask[argName] = args[argName];
        });
        return foundTask;
      }
      return null;
    },
    markTaskAsDoneById(obj, args, context, info) {
      const foundTask = mockTasks.find((task) => task.id === args.id);
      if (foundTask) {
        foundTask.done = true;
        return foundTask;
      }
      return null;
    },
  },
  Task: {
  }
};
