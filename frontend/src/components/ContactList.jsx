const ContactInfo = ({ person, onDelete }) => (
  <p>
    {person.name} {person.number}
    <button style={{ margin: "auto 10px" }} onClick={() => onDelete(person.id)}>
      delete
    </button>
  </p>
);

const ContactList = ({ persons, onDelete }) => {
  return (
    <>
      {persons.map((person) => (
        <ContactInfo key={person.id} person={person} onDelete={onDelete} />
      ))}
    </>
  );
};

export default ContactList;
