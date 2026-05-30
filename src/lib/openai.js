const Groq = require("groq-sdk");

let groq = null;

const getClient = () => {
  if (!process.env.GROQ_API_KEY) {
    throw new Error("GROQ_API_KEY nuk është vendosur në .env");
  }
  if (!groq) {
    groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
  }
  return groq;
};

module.exports = getClient;
