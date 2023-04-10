import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ItProjectAPI from '../../API/ItProjectAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';;

const ItProject = () => {

  let [ItProjects, setItProjects] = useState([]);


  let [fetchItProjects, isProjectsLoading, errorProject] = useFetching(async (id) => {
    const reponse = await ItProjectAPI.list();
    let data = await reponse.json();
    setItProjects(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchItProjects === "function") {fetchItProjects() }
  }, [])

  return (
    <div className="container">
        
        <Link to="/ItProject/new">
          <button className={["button", "blueButton"].join(' ')}>
            Добавить
          </button>
        </Link>
        
        <MyTable data={ItProjects} pageName='ItProject'/>
    </div>
  )
}

export default ItProject