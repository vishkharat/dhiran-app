import axios from "axios";

const API = axios.create({
  baseURL: "https://dhiran-app.onrender.com/api",
});

export default API;