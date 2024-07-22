import React from 'react';
import Nav from './Nav';import Search from './Search';

let Main = () => {
    return (
        <>
                <Nav loggedIn={sessionStorage.getItem("id") == null ? false : true}/>
                <main className="main">
                <Search />
            </main>
        </>
    )

}

export default Main;