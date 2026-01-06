const ContactForm = ({ onSubmit, nameValue, numberValue, onChange }) => {
  return (
    <>
      <form onSubmit={onSubmit}>
        <div>
          <p>
            name:{" "}
            <input
              className="nameInput"
              value={nameValue}
              onChange={onChange}
            />
          </p>
          <p>
            number:{" "}
            <input
              className="numberInput"
              value={numberValue}
              onChange={onChange}
            />
          </p>
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default ContactForm;
