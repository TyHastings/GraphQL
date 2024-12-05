import { useState } from "react"
import { useMutation, gql } from "@apollo/client";

const AddUser = gql`
    mutation($fname: String!, $lname: String!) {
    addUser(fname: $fname, lname: $lname) {
        id
        fname
        lname
    }
    }
`;

export default function Form() {
    const [formData, setFormData] = useState({fname: '', lname: ''})
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
        try {
            const res = await addUser({
                variables: {fname: formData.fname, lname: formData.lname},
            })
            console.log(res)
    }
        catch(error) {
        console.log(error)
        }
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error.message}</p>;
    console.log(data)

    return(
        <div>
            <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "column"}}>
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