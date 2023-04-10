import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import DevelopmentTeamAPI from '../../API/DevelopmentTeamAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';;

const DevelopmentTeam = () => {

  let [DevelopmentTeams, setDevelopmentTeams] = useState([]);


  let [fetchDevelopmentTeams, isDevelopmentTeamsLoading, errorDevelopmentTeam] = useFetching(async (id) => {
    const reponse = await DevelopmentTeamAPI.list();
    let data = await reponse.json();
    setDevelopmentTeams(data.sort((a, b) => a.id > b.id ? 1 : -1))
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
        
        <MyTable data={DevelopmentTeams} pageName='DevelopmentTeam'/>
    </div>
  )
}

export default DevelopmentTeam