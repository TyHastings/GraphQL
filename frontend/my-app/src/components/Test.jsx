import { useQuery, gql } from '@apollo/client';
import React from 'react';

const getUser = gql`
  query($id: String!) {
    user(id: $id) {
      id
      fname
      lname
    }
  }
`;
export default function Test() {

    const {loading, error, data} = useQuery(getUser, {
        variables: {id: '1'}
    });

    console.log(data)
    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;

    return(
        <div>
            <p>Test</p>
            <p>First name: {data.user.fname}</p>
            <p>Last name: {data.user.lname}</p>
            <p>id: {data.user.id}</p>
        </div>
    )
}