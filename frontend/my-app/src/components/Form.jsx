import { useState } from "react"
import { useMutation, gql } from "@apollo/client";

const AddUser = gql`
    mutation($id: String!, $fname: String!, $lname: String!) {
    addUser(id: $id, fname: $fname, lname: $lname) {
        id
        fname
        lname
    }
    }
`;

export default function Form() {
    const [formData, setFormData] = useState({id: '', fname: '', lname: ''})
    const [addUser, {data, loading, error}] = useMutation(AddUser)

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
          });
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        console.log(formData)
        const res = await addUser({
            variables: {id: formData.id, fname: formData.fname, lname: formData.lname},
        })
        console.log(res)
    }
    return(
        <div>
            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column"}}>
                <label> ID:
                    <input name="id" value={formData.id} onChange={handleChange} type="text" id="id" required/>
                </label>
                <label> First Name:
                    <input name="fname" value={formData.fname} onChange={handleChange} type="text" id="fname" required/>
                </label>
                <label> Last Name:
                    <input name="lname" value={formData.lname} onChange={handleChange} type="text" id="lname" required/>
                </label>
                <button type="submit">Submit</button>
            </form>
        </div>
    )
}