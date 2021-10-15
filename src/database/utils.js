
function bulkInsertMerge(db, table, data,conflict="id") {
  return db(table)
    .insert(data)
    .onConflict(conflict)
    .merge()
    .catch((err) => {
      console.log(err);
      throw err;
    })
}

function bulkInsertiIgnore(db, table, data,conflict="id") {
  return db(table)
    .insert(data)
    .onConflict(conflict)
    .ignore()
    .catch((err) => {
      console.log(err);
      throw err;
    })
}


module.exports={
    bulkInsertMerge,
    bulkInsertiIgnore
}