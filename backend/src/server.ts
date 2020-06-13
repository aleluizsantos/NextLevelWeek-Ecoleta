import express from "express";
import cors from "cors";
import routes from "./router";
import path from "path";
import { errors } from "celebrate";

require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(routes);

// Request Param
// Query Param
// Request Body

// SELECT * FROM users WHERE name = 'Diego'
// knex('users').where('name', 'Diego').select(*)

app.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

app.use(errors());

app.listen(3333);
