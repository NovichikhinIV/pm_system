import React from 'react'
import { Link } from 'react-router-dom';
import classes from './MyTable.module.css';

const MyTable = ({data, pageName}) => {
  return (
    <div>
        <table className={classes.table}>
        {/* <thead>
            <tr>
                {Object.keys(data[0] || {}).map((key, index) => (
                    <th scope="col" key={`${key}+${index}`}>{key}</th>
                ))}
            </tr>
        </thead> */}
        <thead>
            <tr>
                {Object.entries(data[0]['labels']).map(([key, value], index) => (
                    <th scope="col" key={`${key}+${index}`}>{value}</th>
                ))}
            </tr>
        </thead>
        <tbody>

        {data.map((obj, index) => (
            <tr key={index}>
                {Object.entries(obj).map(([key, value], index) => (
                    key==='id' 
                    ? 
                    <td key={`${obj}+${index}`}>
                        <Link to={`/${pageName}/${value}`}>
                            {value}
                        </Link>
                    </td> 
                    : key==='labels' ?
                    <></>
                    :
                    <td key={`${obj}+${index}`}>{value}</td>
                ))}
            </tr>
        ))}    

        </tbody>
        </table>
    </div>
  )
}

export default MyTable