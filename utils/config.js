require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

console.log(PORT)
console.log(process.env)

module.exports = {
  PORT,
  MONGODB_URI,
};
