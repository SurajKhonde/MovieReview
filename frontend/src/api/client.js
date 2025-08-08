import axios from "axios";

const client = axios.create({
  baseURL: "http://10.249.205.110:8000/api",
});

export default client;
