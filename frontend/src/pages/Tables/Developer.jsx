import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import DeveloperAPI from '../../API/DeveloperAPI';
import DevelopmentTeamAPI from '../../API/DevelopmentTeamAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';
import AuthContext from '../../context/AuthContext'

const Developer = () => {

  let [Developers, setDevelopers] = useState([]);
  let [DevelopersFiltered, setDevelopersFiltered] = useState([]);
  let [DevelopmentTeams, setDevelopmentTeams] = useState([]);
  let [Team, setTeam] = useState('');
  let [isNoData, setIsNoData] = useState(true);
  let [FilterText, setFilterText] = useState('');
  let [IsLoading, setIsLoading] = useState(true);

  let {authTokens} = useContext(AuthContext)


  let [fetchDevelopers, isDevelopersLoading, errorDeveloper] = useFetching(async (id) => {
    const reponse = await DeveloperAPI.list(authTokens.access);
    let data = await reponse.json();
    setDevelopers(data.sort((a, b) => a.id > b.id ? 1 : -1))

    setDevelopersFiltered(data.sort((a, b) => a.id > b.id ? 1 : -1))
    if (data.length !== 0)
    {
      setIsNoData(false)
      setTeam(data[0].team)
    }
  })

  let [fetchDevelopmentTeams, isDevelopmentTeamsLoading, errorDevelopmentTeam] = useFetching(async (id) => {
    const reponse = await DevelopmentTeamAPI.list(authTokens.access);
    let data = await reponse.json();
    setDevelopmentTeams(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchDevelopers === "function") {fetchDevelopers() }
    if(typeof fetchDevelopmentTeams === "function") {fetchDevelopmentTeams() }
  }, [])

  useEffect(() => {
    if(!isDevelopersLoading && !isDevelopmentTeamsLoading) {
      setIsLoading(false)
    }
  }, [isDevelopersLoading, isDevelopmentTeamsLoading])



  const filterHandler = async (e) => {
    e.preventDefault()
    setDevelopersFiltered(Developers.filter((el) => el.team === parseInt(Team)))
    setFilterText(`Разработчики для ${Team} команды разработчиков`)
  }
  
  const filterClearHandler = async (e) => {
    e.preventDefault()
    setDevelopersFiltered(Developers)
    setFilterText('')
  }

  return (
    <div className="container">

      <h1>Команды разработчиков</h1>

      <Link to="/DevelopmentTeam/new">
        <button className={["button", "blueButton"].join(' ')}>
          Добавить команду разработчиков
        </button>
      </Link>
      
      {IsLoading ?
      <></>
      :
      <MyTable data={DevelopmentTeams} pageName='DevelopmentTeam'/>
      }



      <h1>Разработчики</h1>

      <Link to="/Developer/new">
        <button className={["button", "blueButton"].join(' ')}>
          Добавить разработчика
        </button>
      </Link>
      
      {isNoData ?
      <></>
      :
      <div className="filter">
        <div>Команда разработчиков</div>
        
        <select name="team" value={Team} onChange={e => setTeam(e.target.value)}>
        {DevelopmentTeams.map((obj, index) => (
            <option value={obj.id} key={index}>{obj.id}</option>
        ))} 
        </select>

        <button  onClick={(filterHandler)} className={["button", "blueButton"].join(' ')}>Применить</button>
        <button  onClick={(filterClearHandler)} className={["button", "blueButton"].join(' ')}>Очистить</button>

        <div>{FilterText}</div>

        <MyTable data={DevelopersFiltered} pageName='Developer'/>
      </div>
      }

    </div>
  )
}

export default Developer