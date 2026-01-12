const errorHandler = (error, request, response, next) => {
  console.log("Error Name", error.name);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }

  if (error.name === "NotFoundError") {
    return response.status(404).send({ error: error.message });
  }

  if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

export default errorHandler;
