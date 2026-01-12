import express from "express";
import morgan from "morgan";
import cors from "cors";
import Person from "./models/person.js";
import dotenv from "dotenv";
import unknownEndpoint from "./middlewares/unknownEndpoint.js";
import errorHandler from "./middlewares/errorHandler.js";
import NotFoundError from "./Error/NotFoundError.js";

dotenv.config();

const app = express();

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

app.get("/info", (request, response) => {
  Person.countDocuments({}).then((contactsLength) => {
    response.send(`
    <p>Phonebook has info for ${contactsLength} people</p>
    <p>${new Date()}</p>
    `);
  });
});

app.get("/api/persons", (request, response) => {
  Person.find({}).then((persons) => {
    response.json(persons);
  });
});

app.get("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  Person.findById(id)
    .then((person) => {
      if (!person) throw new NotFoundError("Contact Not Found");
      response.json(person);
    })
    .catch((err) => next(err));
});

app.post("/api/persons", (request, response, next) => {
  const body = request.body;

  const missingFields = [];
  Object.keys(body).forEach((key) =>
    !body[key] ? missingFields.push(key) : missingFields
  );

  if (missingFields.length > 0) {
    return response.status(400).json({
      message: `content missing (${missingFields.join(", ")})`,
    });
  }

  Person.findOne({ name: body.name })
    .then((person) => {
      if (person)
        return response.status(400).json({ message: "name must be unique" });
      else {
        const person = new Person({
          name: body.name,
          number: body.number,
        });
        person
          .save()
          .then((savedPerson) => {
            return response.status(201).json(savedPerson);
          })
          .catch((err) => next(err));
      }
    })
    .catch((err) => next(err));
});

app.put("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  const body = request.body;

  const missingFields = [];
  Object.keys(body).forEach((key) =>
    !body[key] ? missingFields.push(key) : missingFields
  );

  if (missingFields.length > 0) {
    return response.status(400).json({
      message: `content missing (${missingFields.join(", ")})`,
    });
  }

  const person = { name: body.name, number: body.number };

  Person.findByIdAndUpdate(id, person, {
    new: true,
    runValidators: true,
    context: "query",
  })
    .then((updatedPerson) => {
      if (!updatedPerson) throw new NotFoundError("Contact Not Found");
      response.json({ message: "Contact updated successfully", updatedPerson });
    })
    .catch((err) => next(err));
});

app.delete("/api/persons/:id", (request, response, next) => {
  const { id } = request.params;
  Person.findByIdAndDelete(id)
    .then((deletedContact) => {
      if (!deletedContact) throw new NotFoundError("Contact Not Found");
      response.json({
        message: "Contact deleted successfully",
        deletedContact,
      });
    })
    .catch((err) => next(err));
});

// Los middlewares actúan por orden de aparición de arriba a abajo. Hay que asegurarse
// que estén declarado al final, después de la definición de los endpoints.
app.use(unknownEndpoint);
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
