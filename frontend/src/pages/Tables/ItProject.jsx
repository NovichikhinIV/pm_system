import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import ItProjectAPI from '../../API/ItProjectAPI';
import DevelopmentTeamAPI from '../../API/DevelopmentTeamAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';
import AuthContext from '../../context/AuthContext'

const ItProject = () => {

  let [ItProjects, setItProjects] = useState([]);
  let [ItProjectsFiltered, setItProjectsFiltered] = useState([]);
  let [DevelopmentTeams, setDevelopmentTeams] = useState([]);
  let [Team, setTeam] = useState('-');
  let [isNoData, setIsNoData] = useState(true);
  let [FilterText, setFilterText] = useState('');

  let {authTokens} = useContext(AuthContext)


  let [fetchItProjects, isProjectsLoading, errorProject] = useFetching(async (id) => {
    const reponse = await ItProjectAPI.list(authTokens.access);
    let data = await reponse.json();
    setItProjects(data.sort((a, b) => a.id > b.id ? 1 : -1))

    setItProjectsFiltered(data.sort((a, b) => a.id > b.id ? 1 : -1))
    if (data.length !== 0)
    {
      setIsNoData(false)
    }
  })

  let [fetchDevelopmentTeams, isDevelopmentTeamsLoading, errorDevelopmentTeam] = useFetching(async (id) => {
    const reponse = await DevelopmentTeamAPI.list(authTokens.access);
    let data = await reponse.json();
    setDevelopmentTeams(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchItProjects === "function") {fetchItProjects() }
    if(typeof fetchDevelopmentTeams === "function") {fetchDevelopmentTeams() }
  }, [])


  const filterHandler = async (e) => {
    e.preventDefault()
    if(Team !== '-')
    {
      setItProjectsFiltered(ItProjects.filter((el) => el.team === parseInt(Team)))
      setFilterText(`ИТ-проекты для ${Team} команды разработчиков`)
    }
    else {
      filterClearHandler(e)
    }
  }
  
  const filterClearHandler = async (e) => {
    e.preventDefault()
    setItProjectsFiltered(ItProjects)
    setFilterText('')
    setTeam('-')
  }

  return (
    <div className="container">

      <h1>ИТ-проекты</h1>  

      <Link to="/ItProject/new">
        <button className={["button", "blueButton"].join(' ')}>
          Добавить
        </button>
      </Link>
      
      {isNoData ?
      <></>
      :
      <div className="filter">
        <div>Команда разработчиков</div>
        
        <select name="team" value={Team} onChange={e => setTeam(e.target.value)}>
        <option>-</option>
        {DevelopmentTeams.map((obj, index) => (
            <option value={obj.id} key={index}>{obj.id}</option>
        ))} 
        </select>

        <button  onClick={(filterHandler)} className={["button", "blueButton"].join(' ')}>Применить</button>
        <button  onClick={(filterClearHandler)} className={["button", "blueButton"].join(' ')}>Очистить</button>
        
        {ItProjectsFiltered.length === 0 ?
        <></>
        :
        <>
        <div>{FilterText}</div>
        <MyTable data={ItProjectsFiltered} pageName='ItProject'/>
        </>
        }
      </div>
      }

    </div>
  )
}

export default ItProject