import React from 'react'
import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
        <div className="wrapper">
            <header className="menu">
                <div className="container">
                    <div className="menu__links">
                        <Link className="menu__item" to="/ItProject">ItProject</Link>
                        <Link className="menu__item" to="/DevelopmentTeam">DevelopmentTeam</Link>
                        <Link className="menu__item" to="/Developer">Developer</Link>
                        <Link className="menu__item" to="/Task">Task</Link>
                        <Link className="menu__item" to="/Subtask">Subtask</Link>
                        <Link className="menu__item" to="/Expenses">Expenses</Link>
                    </div>
                </div>
            </header>

            <main className="main">
                <Outlet />
            </main>

            <footer className="footer">
                <div className='container'>
                    <div className="footer__row">
                        <div className="footer__text">pm_system</div>
                    </div>
                </div>
		    </footer>
        </div>
        </>
    )
}

export {Layout}