import React, {useContext} from 'react'
import AuthContext from '../context/AuthContext'
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    let {user, logoutUser} = useContext(AuthContext)
    return (
        <>
        <div className="wrapper">
            <header className="menu">
                <div className="container">
                    <div className="menu__links">
                        <Link className="menu__item" to="/">Главная</Link>
                        <div className="menu__links_center">
                            <Link className="menu__item" to="/ItProject">ИТ-проекты</Link>
                            {/* <Link className="menu__item" to="/DevelopmentTeam">Команды разработчиков</Link> */}
                            <Link className="menu__item" to="/Developer">Разработчики</Link>
                            <Link className="menu__item" to="/Task">Задачи</Link>
                            <Link className="menu__item" to="/Subtask">Подзадачи</Link>
                            <Link className="menu__item" to="/Expenses">Затраты</Link>
                        </div>
                        {user 
                        ?
                        <p className="menu__item" onClick={logoutUser}>Выйти</p>
                        :
                        <Link className="menu__item" to="/login">Вход</Link>
                        }
                    </div>
                </div>
            </header>

            <main className="main">
                <Outlet />
            </main>

            <footer className="footer">
                <div className='container'>
                    <div className="footer__row">
                        <div className="footer__text">Система управления ИТ-проектами</div>
                    </div>
                </div>
		    </footer>
        </div>
        </>
    )
}

export {Layout}