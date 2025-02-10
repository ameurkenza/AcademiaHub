// src/components/ListUsers.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import User from './User';
import './ListUsers.css';

function ListUsers() {
  const [users, setUsers] = useState([]);
  const serverUrl = import.meta.env.VITE_SERVER_URL;

  const getUsers = () => {
    axios.get(`${serverUrl}/users`)
      .then(res => {
        setUsers(res.data.data.users);
        console.log("users", res.data.data.users);
      })
      .catch(err => console.error("Erreur lors de la récupération des utilisateurs", err));
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <main className="wrapper">
      <h1>Liste des utilisateurs</h1>
      <div className="item-list">
        {users.map(user => <User firstUser={user} key={user.id} />)}
      </div>
    </main>
  );
}

export default ListUsers;
