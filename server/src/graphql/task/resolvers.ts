const mockTasks = [
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
    taskById(obj, args, context, info) {
      return mockTasks.find((task) => task.id === args.id);
    },
    taskByUserId(obj, args, context, info) {
      return mockTasks.find((task) => task.id === args.id);
    }
  },
  Task: {
  }
};
