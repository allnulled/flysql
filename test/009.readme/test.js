module.exports = async function (Flysql) {

  const fs = require("fs");

  fs.unlinkSync(__dirname + "/test.sqlite");

  const { assertion } = Flysql;

  const flysql = Flysql.create({
    filename: "test.sqlite",
    trace: true,
    traceSql: true
  });
  flysql.connect();
  flysql.addSchema({
    tables: {
      Usuario: {
        columns: {
          name: {type: "string", maxLength: 255, unique: true},
          email: {type: "string", maxLength: 255, unique: true},
          password: {type: "string", maxLength: 255}
        }
      },
      Grupo: {
        columns: {
          name: {type: "string", maxLength: 255, unique: true},
          description: {type: "string", maxLength: 255},
        }
      },
      Permiso: {
        columns: {
          name: {type: "string", maxLength: 255, unique: true},
          description: {type: "string", maxLength: 255},
        }
      },
      Sesion: {
        columns: {
          token: {type: "string", maxLength: 100, unique: true},
          id_usuario: {type: "object-reference", referredTable: "Usuario"},
        }
      }
    }
  });
  flysql.insertOne("Usuario", { name: "u1", password: "u1", email: "u1@mail.com" });
  flysql.insertMany("Usuario", [
    { name: "u2", password: "u1", email: "u2@mail.com" },
    { name: "u3", password: "u1", email: "u3@mail.com" },
    { name: "u4", password: "u4", email: "u4@mail.com" },
  ]);

  const u1 = flysql.selectOne("Usuario", 1);
  const uN = flysql.selectMany("Usuario", [
    ["name", "is in", ["u2", "u3", "u4"]]
  ]);

  assertion(typeof u1 === "object", "assertion");
  assertion(typeof u1.name === "string", "assertion");
  assertion(u1.name === "u1", "assertion");

  assertion(typeof uN === "object", "assertion");
  assertion(Array.isArray(uN), "assertion");
  assertion(uN.length === 3, "assertion");
  assertion(uN[0].name === "u2", "assertion");
  assertion(uN[1].name === "u3", "assertion");
  assertion(uN[2].name === "u4", "assertion");

  console.log("[*] Completado test: 009.readme");

};