import { useState, useEffect } from "react";
import ContactList from "./components/ContactList";
import ContactForm from "./components/ContactForm";
import FilterByName from "./components/FilterByName";
import contactServices from "./services/contacts";
import Notification from "./components/Notification";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newPhone, setNewPhone] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [notification, setNotification] = useState({
    message: null,
    type: null,
  });

  const fetchPersons = () => {
    contactServices.getAll().then((contacts) => {
      setPersons(contacts);
    });
  };

  const handleShowNotification = (message, type) => {
    setNotification({ message, type });
    setTimeout(() => setNotification({ message: null, type: null }), 3000);
  };

  useEffect(fetchPersons, []);

  const handleNewContact = (event) => {
    event.preventDefault();

    if (newName === "" || newPhone === "") {
      handleShowNotification("Missing field(s)", "warning");
      return;
    }

    if (persons.find((person) => person.name === newName)) {
      window.alert(`${newName} is already added to phonebook`);
      setNewName("");
      setNewPhone("");
      return;
    }

    // Dejamos al servidor que se encargue de la generación de un id único
    const newContactObj = {
      name: newName,
      number: newPhone,
    };

    contactServices
      .create(newContactObj)
      .then(() => {
        fetchPersons();
        setNewName("");
        setNewPhone("");
        handleShowNotification(`${newName} was successfully added`, "success");
      })
      .catch((error) => console.log(error));
  };

  const handleFormChange = (event) => {
    if (event.target.className === "nameInput") setNewName(event.target.value);
    else if (event.target.className === "numberInput")
      setNewPhone(event.target.value);
  };

  const handleDeleteContact = (id) => {
    const personToDelete = persons.find((person) => person.id === id);
    if (window.confirm(`Delete ${personToDelete.name} ?`)) {
      contactServices
        .deleteContact(id)
        .then(() => {
          fetchPersons();
          handleShowNotification(
            `${personToDelete.name} was successfully deleted`,
            "success"
          );
        })
        .catch((err) => console.log(err));
    }
  };

  const filteredContacts =
    nameFilter === ""
      ? persons
      : persons.filter((person) =>
          person.name.toLowerCase().includes(nameFilter.toLowerCase())
        );

  return (
    <>
      <h2>Phonebook</h2>
      <Notification notification={notification} />
      <FilterByName
        value={nameFilter}
        onChange={(e) => setNameFilter(e.target.value)}
      />
      <h3>add a new</h3>
      <ContactForm
        onSubmit={handleNewContact}
        nameValue={newName}
        numberValue={newPhone}
        onChange={handleFormChange}
      />
      <h3>Numbers</h3>
      <ContactList persons={filteredContacts} onDelete={handleDeleteContact} />
    </>
  );
};

export default App;
