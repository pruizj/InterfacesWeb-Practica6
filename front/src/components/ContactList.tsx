import React, { useEffect,FC } from "react";
import {gql, useQuery} from "@apollo/client";
import styled from "styled-components";

type Contact = {
    _id: string,
    name: string,
    surname: string,
    email: string,
    phone: string
}
const GET_CONTACTS = gql`
    query Query {
        getContacts {
            _id
            name
            surname
            email
            phone
        }
    }
`;

const GET_CONTACTS_AZ = gql`
    query Query {
        getContactsAZ {
            _id
            name
            surname
            email
            phone
        }
    }
`;

const GET_CONTACTS_ZA = gql`
    query Query {
        getContactsZA {
            _id
            name
            surname
            email
            phone
        }
    }
`;

const ContactList : FC <{inputvalue: number }> = ({inputvalue}) => {

    let values;
    let err;
    let load;

    const {data:contact_data, loading:contact_loading,error:contact_error} = useQuery<{getContacts:Contact[]}>(
        GET_CONTACTS,
    );

    const {data:AZ_data, loading:AZ_loading,error:AZ_error} = useQuery<{getContactsAZ:Contact[]}>(
        GET_CONTACTS_AZ,
    );

    const {data:ZA_data, loading:ZA_loading,error:ZA_error} = useQuery<{getContactsZA:Contact[]}>(
        GET_CONTACTS_ZA,
    );

    if(inputvalue===1){
        values = contact_data?.getContacts;
        load = contact_loading;
        err = contact_error;
    }else if(inputvalue===2){
        values = AZ_data?.getContactsAZ;
        load = AZ_loading;
        err = AZ_error;
    }else if(inputvalue===3){
        values = ZA_data?.getContactsZA;
        load = ZA_loading;
        err = ZA_error;
    }

    if(load) return <div>Cargando...</div>
    if(err) return <div>Error...</div>

    return (
        <div>
            {values?.map((contact)=>(
                <ContactLista key = {contact._id}>
                    Name: {contact.name}
                    <br/>
                    Surname: {contact.surname}
                    <br/>
                    Email: {contact.email}
                    <br/>
                    Phone: {contact.phone}
                </ContactLista>
            ))}
        </div>
    )
}

const ContactLista = styled.div`
    font-weight:bolder;
    font-family: 'Courier New', Courier, monospace;
    margin: 1rem;
    background-color: #d3d3d3;
`

export default ContactList;