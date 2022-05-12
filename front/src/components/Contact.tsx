import React , {useState, FC} from "react";
import {gql, useMutation} from "@apollo/client";
import styled from "styled-components";

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
        <Formulario>
            <Input type="text" value = {email_antiguo} onChange= {
                (e) => setEmail_antiguo(e.target.value)
            }placeholder="Email-Antiguo (Solo cuando Editar)"></Input>
            
            <Input type="text" value = {name} onChange= {
                (e) => setName(e.target.value)
            }placeholder="Nombre"></Input>

            <Input type="text" value = {surname} onChange= {
                (e) => setSurname(e.target.value)
            } placeholder="Apellido"></Input>

            <Input type="text" value = {email} onChange= {
                (e) => setEmail(e.target.value)
            } placeholder="email"></Input>

            <Input type="text" value = {phone} onChange= {
                (e) => setPhone(e.target.value)
            } placeholder="phone"></Input>
        </Formulario>
        <Buttons>
            <Button onClick = {() => addContactMutation({
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
            }>Add</Button>

            <Button onClick = {()=>reloadHandler(2)}>
                A-Z</Button>

            <Button onClick = {()=>reloadHandler(3)}>
                Z-A</Button>
                
            <Button onClick = {() => deleteContactMutation({
                variables: {
                    email
                },
            }).then(() => {
                reloadHandler(1);
                setEmail("");
            })
            }>Delete</Button>

            <Button onClick = {() => editContactMutation({
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
            }>Edit</Button>
        </Buttons>
    </div>
}

const Formulario = styled.div`
  display:flex;
  flex-direction: column;
`

const Input = styled.input`
    margin-top: 2%;
    margin-right: 2%;
    margin-left: 2%;
    width: auto;
    height: 5%;
    margin-bottom: 2%;
    font-size:large;
    font-family: 'Courier New', Courier, monospace;
    text-align: left;
    box-shadow: 5px black;
    box-decoration-break: clone;
`
const Buttons = styled.div`
    display:flex;
    flex-direction: row;
    flex-wrap: wrap;
    gap:5px;
    justify-content: center;
`
const Button = styled.button`
    height: 5%;
    width: 15%;
    margin-top: inherit;
    margin-left: 5px;
    margin-right: inherit;
    margin-bottom: inherit;
    text-align: center;
    background-color: rgb(77, 74, 74);
    color: rgb(255, 255, 255);
    font-family: Arial, Helvetica, sans-serif;
    font-size: large;
    overflow: hidden;
`

export default Contact;