import { useQuery, gql } from '@apollo/client';
import React from 'react';
import Styles from "./styles.module.css"
import UserCard from '../UserCard/UserCard';

/*
const getUser = gql`
  query($id: String!) {
    user(id: $id) {
      id
      fname
      lname
    }
  }
`;
*/

const getUsers = gql`
  query {
    getUsers {
      id
      fname
      lname
    }
  }
`;

export default function Test() {

  const userList = (userData) => {

    return (
      userData.map(user => {
        return (
          <UserCard user={user} />
        )
      })
    )
  }

    const {loading, error, data} = useQuery(getUsers);

    console.log(data)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return (
      <div className={Styles.UserList}>
        {userList(data.getUsers)}
      </div>
    )
}