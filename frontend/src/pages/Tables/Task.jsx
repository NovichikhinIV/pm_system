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
  let [Dev, setDev] = useState('-');
  let [Status, setStatus] = useState('-');
  let [isNoData, setIsNoData] = useState(true);
  let [FilterText, setFilterText] = useState('');

  let {authTokens} = useContext(AuthContext)


  let [fetchTasks, isTasksLoading, errorTask] = useFetching(async (id) => {
    const reponse = await TaskAPI.list(authTokens.access);
    let data = await reponse.json();
    setTasks(data.sort((a, b) => a.id > b.id ? 1 : -1))
    console.log(data)
    setTasksFiltered(data.sort((a, b) => a.id > b.id ? 1 : -1))
    if (data.length !== 0)
    {
      setIsNoData(false)
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
    if(Dev !== '-' && Status !== '-') {
      setTasksFiltered(Tasks.filter((el) => (el.developer === parseInt(Dev)) && (el.status === Status)))
      setFilterText(`Задачи для ${Dev} разработчика, статус ${Status}`)
    }
    else if(Dev !== '-')
    {
      setTasksFiltered(Tasks.filter((el) => el.developer === parseInt(Dev)))
      setFilterText(`Задачи для ${Dev} разработчика`)
    }
    else if(Status !== '-')
    {
      setTasksFiltered(Tasks.filter((el) => el.status === Status))
      setFilterText(`статус ${Status}`)
    }
    else {
      filterClearHandler(e)
    }
  }


  const filterClearHandler = async (e) => {
    e.preventDefault()
    setTasksFiltered(Tasks)
    setFilterText('')
    setDev('-')
    setStatus('-')
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
      <>
      <div className="filterContainer">
        <div className="filter">
          <div>Разработчик</div>
          
          <select name="dev" value={Dev} onChange={e => setDev(e.target.value)}>
          <option>-</option>
          {Developers.map((obj, index) => (
              <option value={obj.id} key={index}>{obj.id}</option>
          ))} 
          </select>
        </div>

        <div className="filter">
          <div>Статус задачи</div>
          
          <select name="status" value={Status} onChange={e => setStatus(e.target.value)}>
            <option>-</option>
            <option>не начато</option>
            <option>в процессе</option>
            <option>выполнено</option>
          </select>
        </div>
      </div>
      
      <button  onClick={(filterHandler)} className={["button", "blueButton"].join(' ')}>Применить</button>
      <button  onClick={(filterClearHandler)} className={["button", "blueButton"].join(' ')}>Очистить фильтры</button>

      {TasksFiltered.length === 0 ?
      <></>
      :
      <>
      <div>{FilterText}</div>
      <MyTable data={TasksFiltered} pageName='Task'/>
      </>
      }
      
      </>
      }

    </div>
  )
}

export default Task