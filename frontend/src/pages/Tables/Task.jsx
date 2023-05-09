import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import TaskAPI from '../../API/TaskAPI';
import DeveloperAPI from '../../API/DeveloperAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';
import AuthContext from '../../context/AuthContext'

const Task = () => {

  let [Tasks, setTasks] = useState([]);
  let [TasksFiltered, setTasksFiltered] = useState([]);
  let [Developers, setDevelopers] = useState([]);
  let [Dev, setDev] = useState('');
  let [isNoData, setIsNoData] = useState(true);
  let [FilterText, setFilterText] = useState('');

  let {authTokens} = useContext(AuthContext)


  let [fetchTasks, isTasksLoading, errorTask] = useFetching(async (id) => {
    const reponse = await TaskAPI.list(authTokens.access);
    let data = await reponse.json();
    setTasks(data.sort((a, b) => a.id > b.id ? 1 : -1))

    setTasksFiltered(data.sort((a, b) => a.id > b.id ? 1 : -1))
    if (data.length !== 0)
    {
      setIsNoData(false)
      setDev(data[0].developer)
    }
  })

  let [fetchDevelopers, isDevelopersLoading, errorDeveloper] = useFetching(async (id) => {
    const reponse = await DeveloperAPI.list(authTokens.access);
    let data = await reponse.json();
    setDevelopers(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchTasks === "function") {fetchTasks() }
    if(typeof fetchDevelopers === "function") {fetchDevelopers() }
  }, [])


  const filterHandler = async (e) => {
    e.preventDefault()
    setTasksFiltered(Tasks.filter((el) => el.developer === parseInt(Dev)))
    setFilterText(`Задачи для ${Dev} разработчика`)
  }
  
  const filterClearHandler = async (e) => {
    e.preventDefault()
    setTasksFiltered(Tasks)
    setFilterText('')
  }

  return (
    <div className="container">

      <h1>Задачи</h1>

      <Link to="/Task/new">
        <button className={["button", "blueButton"].join(' ')}>
          Добавить
        </button>
      </Link>
      
      {isNoData ?
      <></>
      :
      <div className="filter">
        <div>Разработчик</div>
        
        <select name="dev" value={Dev} onChange={e => setDev(e.target.value)}>
        {Developers.map((obj, index) => (
            <option value={obj.id} key={index}>{obj.id}</option>
        ))} 
        </select>

        <button  onClick={(filterHandler)} className={["button", "blueButton"].join(' ')}>Применить</button>
        <button  onClick={(filterClearHandler)} className={["button", "blueButton"].join(' ')}>Очистить</button>
  
        <div>{FilterText}</div>

        <MyTable data={TasksFiltered} pageName='Task'/>
      </div>
      }

    </div>
  )
}

export default Task