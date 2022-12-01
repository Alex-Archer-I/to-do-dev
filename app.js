import React, {useState, useEffect} from 'react';

import TaskField from './components/task-field';
import TaskFull from './components/task-full';
import TaskForm from './components/task-form';

/* const tasks = [
  {
    id: '0',
    title: 'Задание 1',
    text: 'Описание задания',
    date: '2022-12-04 19:00',
    files: [],
    sucsess: false,
  },
  {
    id: '1',
    title: 'Задание 2',
    text: 'Описание задания',
    date: '2022-12-30 12:00',
    files: ['text.txt', 'text2.txt'],
    sucsess: false,
  },
  {
    id: '2',
    title: 'Задание 3',
    text: 'Описание задания',
    date: '2022-12-03 19:00',
    files: [],
    sucsess: false,
  },
]; */

const App = () => {
  const [config, setConfig] = useState({
    tasksList: [],
    display: 'list',
    activeTask: null,
  });

  useEffect(() => {
    fetch('/tasks').then(data => data.json()).then(data => setConfig({
      tasksList: data,
      display: 'list',
      activeTask: null,
    }));
  }, []);

  const chooseTask = (id) => {
    setConfig(config => {
      const newConfig = {...config};

      for (const task of newConfig.tasksList) {
        if (task.id === id) {
          newConfig.activeTask = task;
        };
      };
      newConfig.display = 'full';
      return newConfig;
    });
  };

  const openFormNewTask = () => {
    setConfig(config => {
      const newConfig = {...config};
      newConfig.activeTask = null;
      newConfig.display = 'form';
      return newConfig;
    });
  };

  const openFormUpdateTask = () => {
    setConfig(config => {
      const newConfig = {...config};
      newConfig.display = 'form';
      return newConfig;
    });
  };

  const openTaskList = () => {
    setConfig(config => {
      const newConfig = {...config};
      newConfig.display = 'list';
      return newConfig;
    });
  };

  const createTask = (task) => {
    task.id = config.tasksList.length.toString();

    const newTasksArray = [...config.tasksList];
    newTasksArray.push(task);

    fetch('/tasks', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTasksArray),
    });

    setConfig(config => {
      const newConfig = {...config};
      newConfig.tasksList = newTasksArray;
      newConfig.display = 'list';
      return newConfig;
    });
  };

  const deleteTask = (id) => {
    const newTasksArray = config.tasksList.filter(task => {
      return task.id !== id;
    });

    fetch('/tasks', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTasksArray),
    });

    setConfig(config => {
      const newConfig = {...config};
      newConfig.tasksList = newTasksArray;
      newConfig.display = 'list';
      return newConfig;
    });
  };

  const updateTask = (newTask, id) => {
    const newTasksArray = [...config.tasksList];

    for (let task of newTasksArray) {
      if (task.id === id) {
        task.title = newTask.title;
        task.text = newTask.text;
        task.date = newTask.date;
        task.files = newTask.files;
      };
    };

    fetch('/tasks', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTasksArray),
    });

    setConfig(config => {
      const newConfig = {...config};
      newConfig.tasksList = newTasksArray;
      newConfig.display = 'list';
      return newConfig;
    });
  };

  const sucsessTask = (id) => {
    const newTasksArray = [...config.tasksList];

    for (const task of newTasksArray) {
      if (task.id === id) {
        task.sucsess = true;
      };
    };

    fetch('/tasks', {
      method: 'POST',
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(newTasksArray),
    });

    setConfig(config => {
      const newConfig = {...config};
      config.tasksList = newTasksArray;
      return newConfig;
    });
  };

  if (config.display === 'list') {
    return (
      <TaskField tasks={config.tasksList} chooseTask={chooseTask} openForm={openFormNewTask} sucsessTask={sucsessTask} deleteTask={deleteTask}/>
    );
  };

  if (config.display === 'full') {
    return (
      <TaskFull task={config.activeTask} openTaskList={openTaskList} sucsessTask={sucsessTask} openForm={openFormUpdateTask} deleteTask={deleteTask}/>
    );
  };

  if (config.display === 'form') {
    let task = null;

    if (config.activeTask) {
      task = {...config.activeTask};
    };

    return (
      <TaskForm task={task} openTaskList={openTaskList} createTask={createTask} updateTask={updateTask}/>
    );
  };
};

export default App;