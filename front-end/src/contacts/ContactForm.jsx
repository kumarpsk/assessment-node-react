const ContactForm = ({ addContact, setCurrentPage, editingContact, updateContact }) => {

    const handleSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        if (editingContact) {
            updateContact(editingContact._id, data);
        } else {
            addContact(data);
        }
    }

  return (
    <div>
       <form onSubmit={handleSubmit}>
            <p><input type="text" name="firstName" placeholder="First Name" required defaultValue={editingContact ? editingContact.firstName : ''} /></p>
            <p><input type="text" name="lastName" placeholder="Last Name" required defaultValue={editingContact ? editingContact.lastName : ''} /></p>
            <p><input type="email" name="email" placeholder="Email" required defaultValue={editingContact ? editingContact.email : ''} /></p>
            <p><input type="text" name="country" placeholder="Country" required defaultValue={editingContact ? editingContact.country : ''} /></p>
            <p><input type="text" name="phone" placeholder="Phone Number" required defaultValue={editingContact ? editingContact.phone : ''} /></p>
            <p><textarea name="about" placeholder="About You" defaultValue={editingContact ? editingContact.about : ''}></textarea></p>
            <button type="submit">{editingContact ? 'Update Contact' : 'Add Contact'}</button>
            <button type="button" className="cancel" onClick={() => setCurrentPage('list')}>Cancel</button>
        </form>
    </div>
  );
};

export default ContactForm;
