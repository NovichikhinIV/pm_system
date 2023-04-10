import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import SubtaskAPI from '../../API/SubtaskAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';;

const Subtask = () => {

  let [Subtasks, setSubtasks] = useState([]);


  let [fetchSubtasks, isSubtasksLoading, errorSubtask] = useFetching(async (id) => {
    const reponse = await SubtaskAPI.list();
    let data = await reponse.json();
    setSubtasks(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchSubtasks === "function") {fetchSubtasks() }
  }, [])

  return (
    <div className="container">
        
        <Link to="/Subtask/new">
          <button className={["button", "blueButton"].join(' ')}>
            Добавить
          </button>
        </Link>
        
        <MyTable data={Subtasks} pageName='Subtask'/>
    </div>
  )
}

export default Subtask