const FilterByName = ({ value, onChange }) => {
  return (
    <>
      filter shown with{" "}
      <input className="nameInput" value={value} onChange={onChange} />
    </>
  );
};

export default FilterByName;
