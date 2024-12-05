import { useState, useEffect } from 'react'
import { useMutation, gql, useQuery, useSubscription } from "@apollo/client";
import Styles from './styles.module.css'



  const AddMessage = gql`
    mutation($content: String!, $userID: String!) {
    addMessage(content: $content, userID: $userID) {
        id
        content
        userID
    }
    }
`;

const getMessages = gql`
    query {
        getMessages {
            id
            content
            userID
        }
    }
`;

const messageAdded = gql`
    subscription {
        messageAdded {
            id
            userID
            content
        }
    }
`;

const getUsers = gql`
  query {
    getUsers {
      id
      fname
      lname
    }
  }
`;
  


export default function Messages() {


    const [formData, setFormData] = useState({content: '', userID: ''})
    const [messages, setMessages] = useState([])

    const [addMessage, {data: messageData, loading: messageLoad, error: messageError}] = useMutation(AddMessage)
    const {data: userData} = useQuery(getUsers);
    const { data, loading, error } = useQuery(getMessages);
    const { data: subscriptionData } = useSubscription(messageAdded);
    console.log(data)
    console.log('subscription', subscriptionData)

    useEffect(() => {
      if (data?.getMessages) {
          setMessages(data.getMessages);
      }
    }, [data]);

  console.log(messages)

  useEffect(() => {
    if (subscriptionData) {
        setMessages(prevMessages => [...prevMessages, subscriptionData.messageAdded]);
    }
  }, [subscriptionData]);


    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const res = await addMessage({
                variables: {content: formData.content, userID: formData.userID},
            })
            console.log(res)
    }
        catch(error) {
        console.log(error)
        }
    }

    const handleChange = (e) => {
      setFormData({
          ...formData,
          [e.target.name]: e.target.value
        });
  }

    console.log('form data ', formData)
    return (
      <div style={{display: "flex", flexDirection: "column", alignItems: "center", margin: "5% 0 0 0"}}>
        <div className={Styles.MessageBox}>
          <h2 style={{marginLeft: "45%"}}>Chat</h2>
          <div className={Styles.Messages}>
          {messages && messages.map(message => {
              const user =  userData.getUsers.find((user) => user.id === message.userID)
              return (
              <p>{user.fname + ' ' + user.lname + ': '} {message.content} {"\n"}</p>
            )})}
            </div>
        </div>
        <form onSubmit={handleSubmit} style={{display: "flex", flexDirection: "row", gap: "20px", justifyContent: "center", marginTop: "20px"}}>
                <label>{'Choose a User: '}
                  <select id="userID" name="userID" value={formData.userID} onChange={handleChange} required>
                  <option value="" disabled hidden>Select here</option>
                    {userData.getUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.fname + ' ' + user.lname}
                      </option>
                    ))}
                  </select>
                </label>
                <label> {'Content: '}
                    <input name="content" value={formData.content} onChange={handleChange} type="text" id="content" required/>
                </label>

                <button type="submit">Submit</button>
          </form>
  
    </div>
    )
}