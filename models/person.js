import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

const url = process.env.MONGODB_URI;

mongoose.set("strictQuery");
mongoose
  .connect(url)
  .then((result) => console.log("Connected to MongoDB"))
  .catch((err) => console.log("error connecting to MongoDB:", err.message));

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true,
  },
  number: {
    type: String,
    validate: {
      validator: function (v) {
        return /(?=.{8,})^\d{2,3}-\d+$/.test(v);
      },
      message: (props) => `${props.value} is not a valid number.`,
    },
    required: [true, "Contact phone required"],
  },
});

personSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Person = mongoose.model("Person", personSchema);

export default Person;
