import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import DeveloperAPI from '../../API/DeveloperAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';;

const Developer = () => {

  let [Developers, setDevelopers] = useState([]);


  let [fetchDevelopers, isDevelopersLoading, errorDeveloper] = useFetching(async (id) => {
    const reponse = await DeveloperAPI.list();
    let data = await reponse.json();
    setDevelopers(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchDevelopers === "function") {fetchDevelopers() }
  }, [])

  return (
    <div className="container">
        
        <Link to="/Developer/new">
          <button className={["button", "blueButton"].join(' ')}>
            Добавить
          </button>
        </Link>
        
        <MyTable data={Developers} pageName='Developer'/>
    </div>
  )
}

export default Developer