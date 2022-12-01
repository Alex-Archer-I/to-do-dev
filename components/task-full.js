import React, {useState, useEffect} from 'react';
import dayjs from 'dayjs';

import classes from '../styles/tasks.module.css';
import classesUi from '../styles/ui.module.css';

const TaskFull = (props) => {
    useEffect(() => {
        let interval;
        if (!props.task.sucsess) {
            if (dayjs(`${props.task.date}`).diff(dayjs()) < 0) {
                setIsFailed(true);
            } else {
    
                interval = setInterval(() => {
                    if (dayjs(`${props.task.date}`).diff(dayjs()) < 0) {
                        setIsFailed(true);
                        clearInterval(interval);
                    };
                }, 60000);
            };
        };

        return () => {clearInterval(interval)};
    }, [props.task]);

    const [isFailed, setIsFailed] = useState(false);

    const time = `Выполнить до ${dayjs(props.task.date).date()}-${dayjs(props.task.date).month() + 1}-${dayjs(props.task.date).year()} ${dayjs(props.task.date).hour()}:${dayjs(props.task.date).minute()}`;

    const filesList = props.task.files.map(file => {
        return <li className={`${classes['file-list']} ${classes['file-list-link']}`}><a href={`/file?name=${file}`}>{file}</a></li>;
    });

    return (
        <main className={`${classesUi['card']} ${classes['task-full']}`}>
            <h1>{props.task.title}</h1>
            <p>{props.task.text}</p>

            {!props.task.sucsess && !isFailed ? <p>{time}</p> : null}
            {props.task.sucsess && !isFailed ? <p>Выполненно!</p> : null}
            {isFailed ? <p>Время вышло!</p> : null}

            <ul className={classes['file-list']}>
                {filesList}
            </ul>

            <div className={classesUi['actions']}>
                {!props.task.sucsess && !isFailed ? 
                    <button className={classesUi['btn']} onClick={props.openForm}>Редактировать</button> : null}
                <button className={classesUi['btn']} onClick={() => {props.deleteTask(props.task.id)}}>Удалить</button>
                <button className={classesUi['btn']} onClick={() => {props.openTaskList()}}>Назад</button>
                {!props.task.sucsess && !isFailed ? 
                    <button className={classesUi['btn']} onClick={() => {props.sucsessTask(props.task.id)}}>Выполнить</button> : null}
            </div>
        </main>
    );
};

export default TaskFull;