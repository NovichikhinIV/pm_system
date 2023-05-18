// no need anymore

import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import SubtaskAPI from '../../API/SubtaskAPI';
import TaskAPI from '../../API/TaskAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';
import AuthContext from '../../context/AuthContext'

const Subtask = () => {

  let [Subtasks, setSubtasks] = useState([]);
  let [SubtasksFiltered, setSubtasksFiltered] = useState([]);
  let [Tasks, setTasks] = useState([]);
  let [Task, setTask] = useState('');
  let [isNoData, setIsNoData] = useState(true);
  let [FilterText, setFilterText] = useState('');

  let {authTokens} = useContext(AuthContext)


  let [fetchSubtasks, isSubtasksLoading, errorSubtask] = useFetching(async (id) => {
    const reponse = await SubtaskAPI.list(authTokens.access);
    let data = await reponse.json();
    setSubtasks(data.sort((a, b) => a.id > b.id ? 1 : -1))

    setSubtasksFiltered(data.sort((a, b) => a.id > b.id ? 1 : -1))
    if (data.length !== 0)
    {
      setIsNoData(false)
      setTask(data[0].task)
    }
  })

  let [fetchTasks, isTasksLoading, errorTask] = useFetching(async (id) => {
    const reponse = await TaskAPI.list(authTokens.access);
    let data = await reponse.json();
    setTasks(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchSubtasks === "function") {fetchSubtasks() }
    if(typeof fetchTasks === "function") {fetchTasks() }
  }, [])


  const filterHandler = async (e) => {
    e.preventDefault()
    setSubtasksFiltered(Subtasks.filter((el) => el.task === parseInt(Task)))
    setFilterText(`Подзадачи для ${Task} задачи`)
  }
  
  const filterClearHandler = async (e) => {
    e.preventDefault()
    setSubtasksFiltered(Subtasks)
    setFilterText('')
  }

  return (
    <div className="container">

      <h1>Подзадачи</h1>

      <Link to="/Subtask/new">
        <button className={["button", "blueButton"].join(' ')}>
          Добавить
        </button>
      </Link>
      
      {isNoData ?
      <></>
      :
      <div className="filter">
        <div>Задача</div>
        
        <select name="task" value={Task} onChange={e => setTask(e.target.value)}>
        {Tasks.map((obj, index) => (
            <option value={obj.id} key={index}>{obj.id}</option>
        ))} 
        </select>

        <button  onClick={(filterHandler)} className={["button", "blueButton"].join(' ')}>Применить</button>
        <button  onClick={(filterClearHandler)} className={["button", "blueButton"].join(' ')}>Очистить</button>
  
        <div>{FilterText}</div>

        <MyTable data={SubtasksFiltered} pageName='Subtask'/>
      </div>
      }

    </div>
  )
}

export default Subtask