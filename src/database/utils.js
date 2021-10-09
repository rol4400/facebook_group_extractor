
function bulkInsertMerge(db, table, data) {
    return db(table)
      .insert(data)
      .onConflict("id")
      .merge()
      // .then(() => console.log("data inserted"))
      .catch((err) => {
        console.log(err);
        throw err;
      })
      // .finally(() => {
      //   db.destroy();
      // });
}

module.exports={
    bulkInsertMerge
}