import React, {useState, useRef, useEffect} from 'react';
import dayjs from 'dayjs';

import classes from '../styles/tasks.module.css';
import classesUi from '../styles/ui.module.css';

const TaskForm = (props) => {
    useEffect(() => {
        if (props.task) {
            setFormText({
                title: props.task.title,
                text: props.task.text,
            });
            setFormTime({
                day: dayjs(`${props.task.date}`).diff(dayjs().format(), 'day'),
                hour: dayjs(`${props.task.date}`).diff(dayjs().format(), 'hour')%24,
                minute: dayjs(`${props.task.date}`).diff(dayjs().format(), 'minute')%60,
            });
            setFiles(props.task.files);
        };
    }, [props.task]);

    const [files, setFiles] = useState([]);
    const [formText, setFormText] = useState({
        title: '',
        text: '',
    });
    const [formTime, setFormTime] = useState({
        day: '0',
        hour: '0',
        minute: '0',
    });

    const titleRef = useRef(null);
    const textRef = useRef(null);
    const dayRef = useRef(null);
    const hourRef = useRef(null);
    const minuteRef = useRef(null);
    const fileRef = useRef(null);
    const formFileRef = useRef(null);

    const submitForm = () => {
        let title = titleRef.current.value;
        let text = textRef.current.value;
        let filesArray = [];

        const days = +dayRef.current.value;
        const hours = +hourRef.current.value;
        const minutes = +minuteRef.current.value;

        if (!title) {
            title = 'Без названия';
        };

        if (!text) {
            text = 'У этого задания нет описания. Вы можете добавить его, выбрав задание и нажав "редактировать".';
        };

        if (files.length > 0) {
            filesArray = files;
        }

        const date = dayjs().add(days, 'day').add(hours, 'hour').add(minutes, 'minute');
        const newTask = {
            id: '',
            title: title,
            text: text,
            date: date.format(),
            files: filesArray,
            sucsess: false,
        };

        if (props.task) {
            props.updateTask(newTask, props.task.id);
        } else {
            props.createTask(newTask);
        };
    };

    const addFiles = () => {

        const data = new FormData();
        const newFiles = [];

        for (let i = 0; i < fileRef.current.files.length; i++) {
            newFiles.push(fileRef.current.files[i].name);
            data.append(`${fileRef.current.files[i].name}`, fileRef.current.files[i]);
        };

        fetch('/upload', {
            method: 'POST',
            headers: {
                "Contetnt-Type":"multipart/form-data",
            },
            body: data,
        });

        setFiles((oldFiles) => {
            const newArray = [...oldFiles, ...newFiles];
            return newArray;
        });
    };

    const deleteFiles = (name) => {
        const newFiles = files.filter(file => {
            return file !== name;
        });

        fetch('/delete', {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({name: name}),
        });

        setFiles(newFiles);
    };

    const closeForm = () => {
        fetch('/delete', {
            method: 'DELETE',
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({name: files}),
        });

        props.openTaskList();
    };

    const changeTextHandler = () => {
        setFormText({
            title: titleRef.current.value,
            text: textRef.current.value,
        });
    };

    const changeTimeHandler = (ref, key) => {
        let time = ref.current.value;

        if (time.length > 1) {
            while (time[0] === '0') {
                time = time.slice(1, time.length);
            };
        };

        if (key === 'hour') {
            if (+time > 23) {
                time = '23';
            };
        };

        if (key === 'minute') {
            if (+time > 59) {
                time = '59';
            };
        };

        setFormTime(prevTime => {
            const newTime = {...prevTime};
            newTime[key] = time;
            return newTime;
        });
    };

    const fileList = files.map(file => {
        return <li key={Math.random()}>
            <div>{file}</div>
            <button className={classesUi['btn-close']} onClick={() => {deleteFiles(file)}}></button>
        </li>;
    });

    return (
        <main className={`${classesUi['card']} ${classes['task-form']}`}>
            <form>
                <div className={classes['input']}>
                    <label>Название</label>
                    <input type="text" ref={titleRef} value={formText.title} onChange={changeTextHandler}/>
                </div>
                <div className={classes['input']}>
                    <label>Описание</label>
                    <textarea ref={textRef} value={formText.text} onChange={changeTextHandler}/>
                </div>
                <p>Срок выполнения</p>
                <div className={classes['input-time-field']}>
                    <div className={classes['input-time']}>
                        <label>Дни</label>
                        <input type="number" ref={dayRef} value={formTime.day} onChange={() => {changeTimeHandler(dayRef, 'day')}}/>
                    </div>
                    <div className={classes['input-time']}>
                        <label>Часы</label>
                        <input type="number" ref={hourRef} value={formTime.hour} onChange={() => {changeTimeHandler(hourRef, 'hour')}}/>
                    </div>
                    <div className={classes['input-time']}>
                        <label>Минуты</label>
                        <input type="number" ref={minuteRef} value={formTime.minute} onChange={() => {changeTimeHandler(minuteRef, 'minute')}}/>
                    </div>
                </div>
            </form>

            <ul className={classes['file-list']}>
                {fileList}
            </ul>

            <form encType="multipart/form-data" name="upload" id="upload" ref={formFileRef}>
                <label className={`${classes['input-file']} ${classesUi['btn']}`}>
                    Загрузить файлы
                    <input type="file" ref={fileRef} multiple onChange={addFiles}/>
                </label>
            </form>

            <div className={classesUi['actions']}>
                <button className={classesUi['btn']} onClick={submitForm}>Готово</button>
                {!props.task ? <button className={classesUi['btn']} onClick={closeForm}>Назад</button> : null}
            </div>
        </main>
    );
};

export default TaskForm;