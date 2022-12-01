import React from 'react';

import TaskItem from './task-item';

import classesUi from '../styles/ui.module.css';

const TaskField = (props) => {
    const taskItems = props.tasks.map(task => {
        return <TaskItem
                    title={task.title}
                    date={task.date}
                    key={task.id}
                    id={task.id} 
                    sucsess={task.sucsess}
                    chooseTask={props.chooseTask}
                    sucsessTask={props.sucsessTask}
                    deleteTask={props.deleteTask}/>
    });
    return (
        <main className={classesUi['card']}>
            {taskItems}
            <button className={classesUi['btn']} onClick={() => {props.openForm()}}>Добавить задание</button>
        </main>
    );
};

export default TaskField;