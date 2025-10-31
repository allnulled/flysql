module.exports = async function(Flysql) {

  const fs = require("fs");
  
  fs.unlinkSync(__dirname + "/test.sqlite");

  const { assertion } = Flysql;

  const flysql = Flysql.create({ filename: "test.sqlite" });

  await flysql.connect();

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

  const flysql2 = Flysql.connect({ filename: "test.sqlite" });

  assertion(typeof flysql2.$schema.tables.Usuario === "object", "flysql2.$schema.tables.Usuario debería ser un objeto ahora");
  assertion(typeof flysql2.$schema.tables.Usuario.columns.persona === "object", "flysql2.$schema.tables.Usuario.columns.persona debería ser un objeto ahora");
  assertion(typeof flysql2.$schema.tables.Persona === "object", "flysql2.$schema.tables.Persona debería ser un objeto ahora");
  assertion(typeof flysql2.$schema.tables.Persona.columns.name === "object", "flysql2.$schema.tables.Persona.columns.name debería ser un objeto ahora");

  await flysql2.addTable("Nueva_tabla", {
    columns: {}
  });

  assertion(typeof flysql.$schema.tables.Nueva_tabla !== "object", "flysql2.$schema.tables.Nueva_tabla no debería ser un objeto ahora");
  
  await flysql.reloadSchema();
  
  assertion(typeof flysql.$schema.tables.Nueva_tabla === "object", "flysql2.$schema.tables.Nueva_tabla debería ser un objeto ahora");

  console.log("[*] Completado test: 004.schema persistence");

};