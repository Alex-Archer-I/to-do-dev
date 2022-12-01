import React, {useState, useEffect} from 'react';
import dayjs from 'dayjs';

import classes from '../styles/tasks.module.css';
import classesUi from '../styles/ui.module.css';

const TaskItem = (props) => {
    const [time, setTime] = useState('Выполненно!');
    const [isFailed, setIsFailed] = useState(false);

    useEffect(() => {
        let interval;
        if (!props.sucsess) {
            if (dayjs(`${props.date}`).diff(dayjs()) < 0) {
                setIsFailed(true);
                setTime('Время истекло!');
            } else {
                const days = dayjs(`${props.date}`).diff(dayjs().format(), 'day');
                const hours = dayjs(`${props.date}`).diff(dayjs().format(), 'hour');
                const minute = dayjs(`${props.date}`).diff(dayjs().format(), 'minute');
                setTime(`${days}д. ${hours%24}ч. ${minute%60}м.`);
    
                interval = setInterval(() => {
                    const days = dayjs(`${props.date}`).diff(dayjs().format(), 'day');
                    const hours = dayjs(`${props.date}`).diff(dayjs().format(), 'hour');
                    const minute = dayjs(`${props.date}`).diff(dayjs().format(), 'minute');
                    if (dayjs(`${props.date}`).diff(dayjs()) < 0) {
                        setIsFailed(true);
                        setTime('Время истекло!');
                        clearInterval(interval);
                    } else {
                        setTime(`${days}д. ${hours%24}ч. ${minute%60}м.`);
                    };
                }, 60000);
            };
        };

        return () => {clearInterval(interval)};
    }, [props.sucsess, props.date]);

    let classNames = classes['task-item'];

    if (props.sucsess) {
        classNames = `${classes['task-item']} ${classes['task-item-sucsess']}`;
    } else if (isFailed) {
        classNames = `${classes['task-item']} ${classes['task-item-failed']}`;
    };

    const clickTaskHandler = (event) => {
        if (event.target.localName === 'button') {
            return;
        };
        props.chooseTask(props.id);
    };

    const sucsessHandler = () => {
        setTime('Выполненно!');
        props.sucsessTask(props.id);
    };

    return (
        <article className={classNames} onClick={clickTaskHandler}>
            <h2>{props.title}</h2>
            <div>
                <span>{time}</span>
                <button className={classesUi['btn-close']} onClick={() => {props.deleteTask(props.id)}}></button>
                {!props.sucsess && !isFailed ? <button className={classesUi['btn-sucsess']} onClick={sucsessHandler}></button> : null}
            </div>
        </article>
    );
};

export default TaskItem;