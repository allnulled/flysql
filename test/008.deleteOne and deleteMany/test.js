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

  const id1 = flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x');");
  const id2 = flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x');");
  const id3 = flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x');");
  const id4 = flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x');");

  const allItems1 = flysql.fetchSql("SELECT * FROM Random_item;");
  assertion(allItems1.length === 4, "allItems1.length deberia ser 4 ahora");

  await flysql.deleteOne("Random_item", id1.lastInsertRowid);

  const allItems2 = flysql.fetchSql("SELECT * FROM Random_item;");
  assertion(allItems2.length === 3, "allItems2.length deberia ser 3 ahora");

  await flysql.deleteMany("Random_item", [
    ["id", "is in", [id2.lastInsertRowid, id3.lastInsertRowid]]
  ]);

  const allItems3 = flysql.fetchSql("SELECT * FROM Random_item;");
  assertion(allItems3.length === 1, "allItems3.length deberia ser 1 ahora");


  console.log("[*] Completado test: 008.deleteOne and deleteMany");

};