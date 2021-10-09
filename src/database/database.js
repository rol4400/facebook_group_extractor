//Database schema https://docs.google.com/spreadsheets/d/1CX5qXuuatgkmBrsMR1yJ4A4iB_yHuo74QSP_VSRooqk/edit#gid=0
require("dotenv").config();
const { Parser } = require("json2csv");
const { bulkInsertMerge } = require("./utils");

const connectDb = () => {
  const knex = require("knex")({
    client: "mysql",
    connection: {
      host: process.env.DATABASE_HOST,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_DB,
      port: 3306,
    },
  });
  return knex;
};

const saveData = (db, items) => {
  bulkInsertMerge(db,'users',items)
};

module.exports = {
  saveData,
  connectDb,
};
