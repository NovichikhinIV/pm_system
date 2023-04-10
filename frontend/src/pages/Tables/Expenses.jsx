import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import ExpensesAPI from '../../API/ExpensesAPI';
import MyTable from '../../components/UI/table/MyTable';
import { useFetching } from '../../hooks/useFetching';;

const Expenses = () => {

  let [Expenses, setExpenses] = useState([]);


  let [fetchExpenses, isExpensesLoading, errorExpenses] = useFetching(async (id) => {
    const reponse = await ExpensesAPI.list();
    let data = await reponse.json();
    setExpenses(data.sort((a, b) => a.id > b.id ? 1 : -1))
  })

  useEffect(() => {
    if(typeof fetchExpenses === "function") {fetchExpenses() }
  }, [])

  return (
    <div className="container">
        
        <Link to="/Expenses/new">
          <button className={["button", "blueButton"].join(' ')}>
            Добавить
          </button>
        </Link>
        
        <MyTable data={Expenses} pageName='Expenses'/>
    </div>
  )
}

export default Expenses