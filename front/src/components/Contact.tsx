import React , {useState, FC} from "react";
import {gql, useMutation} from "@apollo/client";

const ADD_CONTACT = gql`
    mutation Mutation($name: String!, $surname: String!, $email: String!, $phone: String!) {
        addContact(name: $name, surname: $surname, email: $email, phone: $phone) {
            _id
            name
            surname
            email
            phone
        }
    }
`;

const DELETE_CONTACT = gql`
    mutation Mutation($email: String) {
        deleteContact(email: $email)
    }
`;

const EDIT_CONTACT = gql`
    mutation Mutation($email_antiguo: String!, $name: String, $surname: String, $email: String, $phone: String) {
        editContact(email_antiguo: $email_antiguo, name: $name, surname: $surname, email: $email, phone: $phone) {
            name
            surname
            phone
            email
        }
    }
`;

const Contact: FC <{reloadHandler:(value:number) => void }> = ({reloadHandler})  => {

    const [name,setName] = useState<string>("");
    const [surname,setSurname] = useState<string>("");
    const [email,setEmail] = useState<string>("");
    const [phone,setPhone] = useState<string>("");
    const [email_antiguo,setEmail_antiguo] = useState<string>("");

    const [addContactMutation] = useMutation(ADD_CONTACT);
    const [deleteContactMutation] = useMutation(DELETE_CONTACT);
    const [editContactMutation] = useMutation(EDIT_CONTACT);

    return <div>
        <input type="text" value = {email_antiguo} onChange= {
            (e) => setEmail_antiguo(e.target.value)
        }placeholder="Email-Antiguo"></input>
        
        <input type="text" value = {name} onChange= {
            (e) => setName(e.target.value)
        }placeholder="Nombre"></input>

        <input type="text" value = {surname} onChange= {
            (e) => setSurname(e.target.value)
        } placeholder="Apellido"></input>

        <input type="text" value = {email} onChange= {
            (e) => setEmail(e.target.value)
        } placeholder="email"></input>

        <input type="text" value = {phone} onChange= {
            (e) => setPhone(e.target.value)
        } placeholder="phone"></input>

        <button onClick = {() => addContactMutation({
            variables: {
                name,
                surname,
                email,
                phone
            },
        }).then(() => {
            reloadHandler(1);
            setName("");
            setSurname("");
            setEmail("");
            setPhone("");
        })
        }>Add</button>

        <button onClick = {()=>reloadHandler(2)}>
            A-Z</button>

        <button onClick = {()=>reloadHandler(3)}>
            Z-A</button>
            
        <button onClick = {() => deleteContactMutation({
            variables: {
                email
            },
        }).then(() => {
            reloadHandler(1);
            setEmail("");
        })
        }>Delete</button>

        <button onClick = {() => editContactMutation({
            variables: {
                email_antiguo,
                name,
                surname,
                email,
                phone
            },
        }).then(() => {
            reloadHandler(1);
            setName("");
            setSurname("");
            setEmail("");
            setPhone("");
            setEmail_antiguo("");
        })
        }>Edit</button>
    </div>
}

export default Contact;