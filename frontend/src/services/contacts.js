import axios from "axios";
const BASE_URL = "http://localhost:3001/api/persons";

const getAll = async () => {
  const request = axios.get(BASE_URL);
  return request.then((response) => response.data);
};

const create = async (contactObj) => {
  const request = axios.post(BASE_URL, contactObj);
  return request.then((response) => response.data);
};

const update = async (id, contactObj) => {
  const request = axios.put(`${BASE_URL}/${id}`, contactObj);
  return request.then((response) => response.data);
};

const deleteContact = async (id) => {
  const request = axios.delete(`${BASE_URL}/${id}`);
  return request.then((response) => response.data);
};

export default { getAll, create, update, deleteContact};
