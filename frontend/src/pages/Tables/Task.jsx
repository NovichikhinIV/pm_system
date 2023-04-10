import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import TaskAPI from '../../API/TaskAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';;

const Task = () => {

  let [Tasks, setTasks] = useState([]);


  let [fetchTasks, isTasksLoading, errorTask] = useFetching(async (id) => {
    const reponse = await TaskAPI.list();
    let data = await reponse.json();
    setTasks(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchTasks === "function") {fetchTasks() }
  }, [])

  return (
    <div className="container">
        
        <Link to="/Task/new">
          <button className={["button", "blueButton"].join(' ')}>
            Добавить
          </button>
        </Link>
        
        <MyTable data={Tasks} pageName='Task'/>
    </div>
  )
}

export default Task