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

  await flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x1'), ('x2');");
  
  const allItems = await flysql.fetchSql("SELECT * FROM Random_item;");

  assertion(allItems.length === 2, "allItems.length debería ser 2 ahora");

  flysql.updateOne("Random_item", 1, { name: "x1.modificado" });
  
  const allItems2 = await flysql.fetchSql("SELECT * FROM Random_item;");

  assertion(allItems2.length === 2, "allItems2.length debería ser 2 ahora");
  assertion(allItems2[0].name === "x1.modificado", "allItems2[0].name debería ser x1.modificado ahora");
  assertion(allItems2[1].name === "x2", "allItems2[1].name debería ser x2 ahora");

  flysql.updateMany("Random_item", [["name", "=", "x2"]], { name: "x2.modificado" });
  
  const allItems3 = await flysql.fetchSql("SELECT * FROM Random_item;");

  assertion(allItems3.length === 2, "allItems3.length debería ser 2 ahora");
  assertion(allItems3[0].name === "x1.modificado", "allItems3[0].name debería ser x1.modificado ahora");
  assertion(allItems3[1].name === "x2.modificado", "allItems3[1].name debería ser x2.modificado ahora");

  console.log("[*] Completado test: 007.updateOne and updateMany");

};