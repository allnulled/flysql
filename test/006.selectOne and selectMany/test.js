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

  await flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x1');");
  await flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x2');");
  await flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x3');");
  await flysql.insertSql("INSERT INTO Random_item (name) VALUES ('x4');");

  const row1 = await flysql.selectOne("Random_item", 1);

  assertion(typeof row1 === "object", "row1 debería ser tipo object ahora");
  assertion(row1.name === "x1", "row1.name debería ser x1 ahora");

  const rows2 = await flysql.selectMany("Random_item", [
    ["name", "is in", ["x3", "x4"]]
  ]);

  assertion(typeof rows2 === "object", "rows2 debería ser tipo object ahora");
  assertion(rows2.length === 2, "rows2.length debería ser 2 ahora");
  assertion(rows2[0].name === "x3", "rows2[0].name debería ser x3 ahora");
  assertion(rows2[1].name === "x4", "rows2[1].name debería ser x4 ahora");

  console.log("[*] Completado test: 006.selectOne and selectMany");

};