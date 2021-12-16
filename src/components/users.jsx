import React, { useState, useEffect } from "react"
import { paginate } from "../api/utils/paginate"
import Pagination from "./pagination"
import User from "./user"
import SearchStatus from "./searchStatus";
import GroupList from "./groupList"
import api from "../api"

const Users = ({ users, ...rest }) => {
    const pageSize = 2

    const [currentPage, setCurrentPage] = useState(1)
    const [professions, setProfessions] = useState(/*api.professions.fetchAll()*/)
    const [selectedProf, setSelectedProf] = useState()

    useEffect(() => {
        api.professions.fetchAll().then(data => setProfessions(data))
    }, [])

    useEffect(() => {
        setCurrentPage(1)
    }, [selectedProf])

    const handleProfessionSelect = item => {
        /*console.log(item)*/
        setSelectedProf(item)
    }

    const handlePageChange = (pageIndex) => {
        /*console.log('pageIndex', pageIndex)*/
        setCurrentPage(pageIndex)
    }

    const clearFilter = () => {
        setSelectedProf()
    }
    
    /*console.log('selectedProf', selectedProf)
    console.log('users', users)*/
    const filteredUsers = selectedProf ? users.filter((user) => user.profession._id === selectedProf._id):users
    const count = filteredUsers.length
    /*console.log(filteredUsers)*/
    const userCrop = paginate(filteredUsers, currentPage, pageSize)

    return (
        <div className="d-flex">
        {professions && (<div className="d-flex flex-column flex-shrink-0 p-3">
                        <GroupList 
                            selectedItem = {selectedProf}
                            items = {professions}
                            onItemSelect = {handleProfessionSelect}
                        />
                        <button className="btn btn-secondary mt-2" onClick={clearFilter}>Очистить</button>
                        </div>
                    )}
            <div className="d-flex flex-column">
            <SearchStatus length={count} />
            {count > 0 && (
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Имя</th>
                            <th scope="col">Качества</th>
                            <th scope="col">Провфессия</th>
                            <th scope="col">Встретился, раз</th>
                            <th scope="col">Оценка</th>
                            <th scope="col">Избранное</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {userCrop.map((user) => (
                            <User {...rest} {...user} key = {user._id} />
                        ))}
                    </tbody>
                </table>
            )}
            <div className="d-flex justify-content-center">
                <Pagination itemCount={count} pageSize = {pageSize} currentPage = {currentPage} onPageChange = {handlePageChange}/>
            </div>
            </div>
        </div>
    );
};

export default Users
