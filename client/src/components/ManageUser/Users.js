import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import UserService from '../../services/userService';
import { toast } from 'react-toastify'
import './Users.scss';
import ModalDelete from './ModalDelete';
import ModalUser from './ModalUser';

function Users(props) {

    const [userList, setUserList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [currentLimit, setCurrentLimit] = useState(3);
    const [showModalDelete, setShowModalDelete] = useState(false);
    const [showModalUser, setShowModalUser] = useState(false);

    const [totalPage, setTotalPageCount] = useState(50);
    const [dataModal, setDataModal] = useState(null);
    const [actionModalUser, setActionModalUser] = useState('');

    useEffect(() => {

        fetchAllUsers();
    }, [currentPage]);

    const fetchAllUsers = async (page) => {
        let response = await UserService.fetchAllUsers(page ? page : currentPage, currentLimit);
        if (response && response.data && response.data.errCode === '0') {
            response.data = response.data.data;
            setUserList(response.data.userList);
            setTotalPageCount(response.data.totalPage);
        }
    }

    const handlePageClick = async (event) => {
        const newOffset = parseInt(event.selected) + 1;
        setCurrentPage(newOffset);
    };

    const handleDeleteUser = async (userID) => {
        setDataModal(userID);
        setShowModalDelete(true);
    }

    const handleCreateUser = async () => {
        setShowModalUser(true);
        setActionModalUser("CREATE");
    }

    const handleCloseModalDelete = async () => {
        setShowModalDelete(false);
        setDataModal(null);
    }


    const handleUpdateUser = async (user) => {
        setDataModal(user);
        setShowModalUser(true);
        setActionModalUser("EDIT");
    }

    const handleCloseModalUser = async () => {
        setShowModalUser(false);
        setDataModal(null);
        await fetchAllUsers();
    }

    const handleConfirmModalDelete = async () => {
        let response = await UserService.deleteUser(dataModal);
        if (response && response.data && response.data.errCode === '0') {
            toast.success(response.data.errMsg);
            await fetchAllUsers();
        } else {
            toast.error("Error deleting user");
            if (response && response.data) {
                toast.error(response.data.errMsg);
            }
        }
        setShowModalDelete(false);
        setDataModal(null);
    }

    const handleSaveModalUser = async () => {
        fetchAllUsers();
    };


    return (
        <div className='container'>
            <div className='manage-users-container'>
                <div className='user-header'>
                    <div className='title'>
                        <h3 >Table of Users</h3>
                    </div>

                    <div className='actions'>
                        <button className='btn btn-success mx-2 mb-3'>Refresh</button>
                        <button className='btn btn-primary mx-2 mb-3' onClick={handleCreateUser}>Add new user</button>
                    </div>

                </div>

                <div className='user-container'>

                    <table className='table table-bordered table-hover'>
                        <thead>
                            <tr>

                                <th scope='col'>#</th>
                                <th scope='col'>User ID</th>
                                <th scope='col'>Email</th>
                                <th scope='col'>Username</th>
                                <th scope='col'>Sex</th>
                                <th scope='col'>Phone</th>
                                <th scope='col'>Address</th>
                                <th scope='col'>Group</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {userList && userList.length > 0
                                ? <>
                                    {userList.map((user, index) => {
                                        return <tr key={index}>
                                            <td scope='row'>{currentLimit * (currentPage - 1) + index + 1}</td>
                                            <td>{user.id}</td>
                                            <td>{user.email}</td>
                                            <td>{user.username}</td>
                                            <td>{user.sex}</td>
                                            <td>{user.phone}</td>
                                            <td>{user.address}</td>
                                            <td>{user.Group?.name} - {user.Group?.description}</td>
                                            <td>
                                                <button id="edit-btn" className='btn btn-warning mx-2'
                                                    onClick={() => handleUpdateUser(user)}>
                                                    Edit
                                                </button>
                                                <button id="delete-btn" className='btn btn-danger mx-2'
                                                    onClick={() => handleDeleteUser(user.id)}>
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>

                                    })}
                                </>
                                : <tr><td><p>Not found Users</p></td></tr>}
                        </tbody>
                    </table>


                    <div className='user-footer'>
                        <ReactPaginate
                            containerClassName='pagination justify-content-center' //important
                            activeClassName='active'
                            breakLabel="..."
                            nextLabel="Next ->"
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={5}
                            marginPagesDisplayed={2}
                            pageCount={totalPage}
                            previousLabel="<- Previous"
                            pageClassName='page-item'
                            pageLinkClassName='page-link'
                            breakClassName='page-item'
                            breakLinkClassName='page-link'
                            previousClassName='page-item'
                            previousLinkClassName='page-link'
                            nextClassName='page-item'
                            nextLinkClassName='page-link'
                            renderOnZeroPageCount={null}
                        />
                    </div>

                </div>
            </div>

            <ModalDelete show={showModalDelete} dataModal={dataModal} handleClose={handleCloseModalDelete} handleDelete={handleConfirmModalDelete} />
            <ModalUser action={actionModalUser} show={showModalUser} dataModal={dataModal} handleClose={handleCloseModalUser} handleSave={handleSaveModalUser} />
        </div>
    );
}

export default Users;