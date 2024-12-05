import Styles from './styles.module.css'
import { useState } from 'react'
import { gql, useMutation } from '@apollo/client'

const DeleteUser = gql`
    mutation($id: String!) {
    deleteUser(id: $id)
    }
`;

const EditUser = gql`
    mutation($id: String!, $fname: String!, $lname: String!) {
    editUser(id: $id, fname: $fname, lname: $lname) {
        id
        fname
        lname
    }
    }
`;

export default function UserCard({user}) {

    const [formData, setFormData] = useState({fname: user.fname, lname: user.lname})
    const [canEdit, setCanEdit] = useState(false)

    const [deleteUser, { loading: deleteLoading, error: deleteError }] = useMutation(DeleteUser);
    const [editUser, {loading: editLoading, error: editError, data: editData}] = useMutation(EditUser)

    const handleDelete = async () => {
        const res = await deleteUser({
            variables: {id: user.id}})

        if(res.data.deleteUser) {
            alert('User successfully deleted. Refresh to see results.')
        } else {
            alert('User deletion failed.')
        }
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
          });
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        console.log(formData)
        try {
            const res = await editUser({
                variables: {id: user.id, fname: formData.fname, lname: formData.lname},
            })
            setCanEdit(false)
            alert("Changes made, refresh to see results.")
            console.log(res)
    }
        catch(error) {
        console.log(error)
        }
    }

    return (
        <div className={Styles.Card}>
            <p>{user.id}</p>
            {!canEdit && <p>{user.fname + ' ' + user.lname}</p>}
            {canEdit && (
                <form onSubmit={handleEdit} style={{display: "flex", flexDirection: "column"}}>
                <label> First Name:
                    <input name="fname" value={formData.fname} onChange={handleChange} type="text" id="fname" required/>
                </label>
                <label> Last Name:
                    <input name="lname" value={formData.lname} onChange={handleChange} type="text" id="lname" required/>
                </label>
                <button type="submit">Submit Changes</button>
                </form>
            )}
            <div>
                <button onClick={() => setCanEdit(!canEdit)}> Edit </button>
                <button onClick={() => handleDelete()}> Delete </button>
            </div>
        </div>
    )
}