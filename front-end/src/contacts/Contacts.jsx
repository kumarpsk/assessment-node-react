import { useState, useEffect } from "react";
import ContactForm from "./ContactForm";
const API_URL = "http://localhost:5000/api/contacts";

const Contacts = () => {
    const [contacts, setContacts] = useState([]);
    const [currentPage, setCurrentPage] = useState('list');
    const [editingContact, setEditingContact] = useState(null);
    const [isLoading, setIsLoading] = useState(false);


    useEffect(() => {
        getContacts();
    }, []);

    const getContacts = () => {
        setIsLoading(true);
        fetch(API_URL)
            .then((response) => response.json())
            .then((data) => setContacts(data.data))
            .catch((error) => console.error("Error fetching contacts:", error))
            .finally(() => setIsLoading(false));
    }

    const addContact = (data) => {
        console.log(data);
        setIsLoading(true);
        fetch(API_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then((response) => response.json())
            .then((newContact) => {
                setContacts([...contacts, newContact.data]);
                setCurrentPage('list');
            })
            .catch((error) => console.error("Error adding contact:", error))
            .finally(() => setIsLoading(false));
    }

    const editContact = (contact) => {
        setEditingContact(contact);
        setCurrentPage('edit');
    }

    const updateContact = (id, data) => {
        setIsLoading(true);
        fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data),
        })
            .then(() => {
                getContacts();
                setCurrentPage('list');
                setEditingContact(null);
            })
            .catch((error) => console.error("Error updating contact:", error))
            .finally(() => setIsLoading(false));
    }

    const deleteContact = (id) => {
        setIsLoading(true);
        fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        })
            .then(() => {
                getContacts();
            })
            .catch((error) => console.error("Error deleting contact:", error))
            .finally(() => setIsLoading(false));
    }

    return (
        <div>
            <div className="contacts-header">
                <h2>Contacts</h2>
                {currentPage === 'list' && <button onClick={() => setCurrentPage('add')}>Add Contact</button>}
            </div>
            <ul>
                {currentPage === 'list' && contacts.map((contact) => (
                    <li key={contact._id}>
                        <div className="contact-card">
                            <p className="edit-container"><span>First Name: {contact.firstName}</span><span><button onClick={() => editContact(contact)}>Edit</button><button className="delete" onClick={() => deleteContact(contact._id)}>Delete</button></span></p>
                            <p>Last Name: {contact.lastName}</p>
                            <p>Email: {contact.email}</p>
                            <p>Phone: {contact.phone}</p>
                            <p>About: {contact.about}</p>
                        </div>
                    </li>
                ))}
                {(currentPage === 'add' || currentPage === 'edit') && <ContactForm addContact={addContact} setCurrentPage={setCurrentPage} editingContact={editingContact} updateContact={updateContact} />}
            </ul>
            {isLoading && <p>Loading...</p>}
        </div>
    );
};

export default Contacts;
