import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import ExpensesAPI from '../../API/ExpensesAPI';
import ItProjectAPI from '../../API/ItProjectAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';
import AuthContext from '../../context/AuthContext'

const Expenses = () => {

  let [Expenses, setExpenses] = useState([]);
  let [ExpensesFiltered, setExpensesFiltered] = useState([]);
  let [ItProjects, setItProjects] = useState([]);
  let [Project, setProject] = useState('');
  let [isNoData, setIsNoData] = useState(true);
  let [FilterText, setFilterText] = useState('');

  let {authTokens} = useContext(AuthContext)


  let [fetchExpenses, isExpensesLoading, errorExpenses] = useFetching(async (id) => {
    const reponse = await ExpensesAPI.list(authTokens.access);
    let data = await reponse.json();
    setExpenses(data.sort((a, b) => a.id > b.id ? 1 : -1))

    setExpensesFiltered(data.sort((a, b) => a.id > b.id ? 1 : -1))
    if (data.length !== 0)
    {
      setIsNoData(false)
      setProject(data[0].project)
    }
  })

  let [fetchItProjects, isProjectsLoading, errorProject] = useFetching(async (id) => {
    const reponse = await ItProjectAPI.list(authTokens.access);
    let data = await reponse.json();
    setItProjects(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchExpenses === "function") {fetchExpenses() }
    if(typeof fetchItProjects === "function") {fetchItProjects() }
  }, [])


  const filterHandler = async (e) => {
    e.preventDefault()
    setExpensesFiltered(Expenses.filter((el) => el.project === parseInt(Project)))
    setFilterText(`Затраты для ${Project} проекта`)
  }
  
  const filterClearHandler = async (e) => {
    e.preventDefault()
    setExpensesFiltered(Expenses)
    setFilterText('')
  }

  return (
    <div className="container">

      <h1>Затраты</h1>

      <Link to="/Expenses/new">
        <button className={["button", "blueButton"].join(' ')}>
          Добавить
        </button>
      </Link>

      {isNoData ?
      <></>
      :
      <div className="filter">
        <div>ИТ-проект</div>
        
        <select name="project" value={Project} onChange={e => setProject(e.target.value)}>
        {ItProjects.map((obj, index) => (
            <option value={obj.id} key={index}>{obj.id}</option>
        ))} 
        </select>

        <button  onClick={(filterHandler)} className={["button", "blueButton"].join(' ')}>Применить</button>
        <button  onClick={(filterClearHandler)} className={["button", "blueButton"].join(' ')}>Очистить</button>
  
        <div>{FilterText}</div>

        <MyTable data={ExpensesFiltered} pageName='Expenses'/>
      </div>
      }

    </div>
  )
}

export default Expenses