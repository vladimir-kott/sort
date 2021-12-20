import React, { useState, useEffect } from "react"
import { paginate } from "../api/utils/paginate"
import Pagination from "./pagination"
import SearchStatus from "./searchStatus";
import GroupList from "./groupList"
import UserTable from "./usersTable";
import api from "../api"
import _ from 'lodash'

const Users = () => {
    const pageSize = 8

    const [currentPage, setCurrentPage] = useState(1)
    const [professions, setProfessions] = useState(/*api.professions.fetchAll()*/)
    const [selectedProf, setSelectedProf] = useState()
    const [sortBy, setSortBy] = useState({iter:'name', order:'asc'})
    const [users, setUsers] = useState()

    useEffect(() => {
        api.users.fetchAll().then(data => setUsers(data))
    }, [])

    const handleDelete = (userId) => {
        setUsers(users.filter((user) => user._id !== userId));
    }

    const handleToggleBookMark = (id) => {
        setUsers(
            users.map((user) => {
                if (user._id === id) {
                    return { ...user, bookmark: !user.bookmark };
                }
                return user;
            })
        )
    }
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

    const handleSort = (item) => {
        setSortBy(item)
        /*setSortBy({iter:item, order:'asc'})
        console.log(item)*/
    }
    
    if (users){
    /*console.log('selectedProf', selectedProf)
    console.log('users', users)*/
    const filteredUsers = selectedProf ? users.filter((user) => JSON.stringify(user.profession) === JSON.stringify(selectedProf)):users
    const count = filteredUsers.length
    const sortedUsers = _.orderBy(filteredUsers, [sortBy.path], [sortBy.order])
    /*console.log(filteredUsers)*/
    const userCrop = paginate(sortedUsers, currentPage, pageSize)

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
                <UserTable 
                users={userCrop} 
                onSort={handleSort} 
                selectedSort = {sortBy} 
                onDelete={handleDelete}
                onToggleBookMark={handleToggleBookMark}
                />
            )}
            <div className="d-flex justify-content-center">
                <Pagination itemCount={count} pageSize = {pageSize} currentPage = {currentPage} onPageChange = {handlePageChange}/>
            </div>
            </div>
        </div>
    );}
    return 'loading...'
};

export default Users
