import express from "express";
import morgan from "morgan";
import cors from "cors";

const app = express();

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
  {
    id: 5,
    name: "Mohamed El Kanboui Bouaacha",
    number: "221-748392",
  },
  {
    id: 6,
    name: "Ilyas El Kanboui Bouaacha",
    number: "023-123456",
  },
  {
    id: 7,
    name: "Adumu González",
    number: "345-219292",
  },
];

app.use(express.json());
app.use(express.static("dist"));
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
      JSON.stringify(req.body),
    ].join(" ");
  })
);
app.use(cors());

const generateID = () => {
  const maxId =
    persons.length > 0 ? Math.max(...persons.map((person) => person.id)) : 0;
  return maxId + 1;
};

app.get("/", (request, response) => {
  response.send(`<h1>Welcome to your phonebook</h1>`);
});

app.get("/info", (request, response) => {
  response.send(`
    <p>Phonebook has info for ${persons.length} people</p>
    <p>${new Date()}</p>
    `);
});

app.get("/api/persons", (request, response) => {
  response.json(persons);
});

app.get("/api/persons/:id", (request, response) => {
  const { id } = request.params;
  const person = persons.find((person) => person.id === Number(id));
  if (!person) return response.status(404).end("Contact not found (404)");
  response.json(person);
});

app.post("/api/persons", (request, response) => {
  const body = request.body;

  const missingFields = [];
  Object.keys(body).forEach((key) =>
    !body[key] ? missingFields.push(key) : missingFields
  );

  if (missingFields.length > 0) {
    return response
      .status(400)
      .json({ error: `content missing (${missingFields.join(", ")})` });
  }

  if (persons.find((person) => person.name === body.name)) {
    return response.status(400).json({ error: "name must be unique" });
  }

  const person = {
    id: generateID(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);

  response.status(201).json(person);
});

app.delete("/api/persons/:id", (request, response) => {
  const { id } = request.params;
  if (!persons.find((person) => person.id === Number(id)))
    return response.status(404).end("Contact not found (404)");
  persons = persons.filter((person) => person.id !== Number(id));
  response.status(204).end();
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
