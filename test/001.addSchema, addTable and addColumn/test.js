module.exports = async function(Flysql) {

  const fs = require("fs");
  
  fs.unlinkSync(__dirname + "/test.sqlite");

  const { assertion } = Flysql;

  const flysql = Flysql.create({ filename: "test.sqlite" });

  await flysql.connect();

  await flysql.addSchema({
    machines: {},
    tables: {
      Grupo: {
        columns: {
          name: {
            type: "string", maxLength: 255
          }
        }
      }
    }
  });

  await flysql.addTable("Persona", {
    columns: {
      name: {
        type: "string",
        maxLength: 100,
      },
      surname: {
        type: "string",
        maxLength: 100,
      },
      age: {
        type: "integer",
      }
    }
  });

  await flysql.addTable("Usuario", {
    columns: {
      name: {
        type: "string",
        maxLength: 100,
        unique: true,
        nullable: false,
      }
    }
  });

  await flysql.addColumn("Usuario", "email", {
    type: "string",
    maxLength: 100,
    unique: true,
    nullable: false,
  });

  await flysql.addColumn("Usuario", "password", {
    type: "string",
    maxLength: 100,
    nullable: false,
  });

  await flysql.addColumn("Usuario", "persona", {
    type: "object-reference",
    referredTable: "Persona",
    nullable: true,
  });

  assertion(typeof flysql.$schema.machines === "object", "La propiedad machines debería aparecer en schema ahora");
  assertion(typeof flysql.$schema.tables.Grupo === "object", "Grupo debería ser una tabla en schema ahora");
  assertion(typeof flysql.$schema.tables.Persona === "object", "Persona debería ser una tabla en schema ahora");
  assertion(typeof flysql.$schema.tables.Usuario === "object", "Persona debería ser una tabla en schema ahora");
  assertion(typeof flysql.$schema.tables.Usuario.columns.persona === "object", "La persona debería ser una columna de Usuario en schema ahora");

  console.log("[*] Completado test: 001.addTable and addColumn");

};