import React, { useEffect, useState, useContext } from 'react'
import { Link } from 'react-router-dom';
import DevelopmentTeamAPI from '../../API/DevelopmentTeamAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';
import AuthContext from '../../context/AuthContext'

const DevelopmentTeam = () => {

  let [DevelopmentTeams, setDevelopmentTeams] = useState([]);
  let [isNoData, setIsNoData] = useState(true);
  let {authTokens} = useContext(AuthContext)


  let [fetchDevelopmentTeams, isDevelopmentTeamsLoading, errorDevelopmentTeam] = useFetching(async (id) => {
    const reponse = await DevelopmentTeamAPI.list(authTokens.access);
    let data = await reponse.json();
    setDevelopmentTeams(data.sort((a, b) => a.id > b.id ? 1 : -1))

    if (data.length !== 0)
    {
      setIsNoData(false)
    }
  })

  useEffect(() => {
    if(typeof fetchDevelopmentTeams === "function") {fetchDevelopmentTeams() }
  }, [])


  return (
    <div className="container">
        
      <Link to="/DevelopmentTeam/new">
        <button className={["button", "blueButton"].join(' ')}>
          Добавить
        </button>
      </Link>
      
      {isNoData ?
      <></>
      :
      <MyTable data={DevelopmentTeams} pageName='DevelopmentTeam'/>
      }

    </div>
  )
}

export default DevelopmentTeam