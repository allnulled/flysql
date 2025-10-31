module.exports = async function (Flysql) {

  const fs = require("fs");

  fs.unlinkSync(__dirname + "/test.sqlite");

  const { assertion } = Flysql;

  const flysql = Flysql.create({ filename: "test.sqlite" });

  await flysql.connect();

  await flysql.addSchema({
    tables: {
      Random_item: {
        columns: {
          name: {
            type: "string", maxLength: 255
          }
        }
      }
    }
  });

  const insertedId1 = await flysql.insertOne("Random_item", { name: "x1" });
  const insertedId3 = await flysql.insertMany("Random_item", [{ name: "x2" }, { name: "x3" }]);
  
  assertion(insertedId1 === 1, "insertedId1 debería ser 1 ahora");
  assertion(insertedId3 === 3, "insertedId3 debería ser 3 ahora");

  const allItems = await flysql.fetchSql("SELECT * FROM Random_item;");

  assertion(allItems.length === 3, `allItems.length debería ser 3 ahora`);

  console.log("[*] Completado test: 005.insertOne and insertMany");

};