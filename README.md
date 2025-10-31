# flysql

Proxy para `better-sqlite3` con gestión nuclear de `schema`.

# Índice

- [flysql](#flysql)
- [Índice](#índice)
- [Instalación](#instalación)
- [API](#api)
  - [`Flysql.create(...args):Flysql`](#flysqlcreateargsflysql)
  - [`Flysql.connect(...args):Flysql`](#flysqlconnectargsflysql)
  - [`Flysql.AssertionError:Function`](#flysqlassertionerrorfunction)
  - [`Flysql.assertion:Function`](#flysqlassertionfunction)
  - [`Flysql.defaultOptions:Object`](#flysqldefaultoptionsobject)
  - [`Flysql.defaultDatabaseOptions:Object`](#flysqldefaultdatabaseoptionsobject)
  - [`Flysql.knownTypes:Array`](#flysqlknowntypesarray)
  - [`Flysql.knownOperators`](#flysqlknownoperators)
  - [`Flysql.checkSchemaColumnValidity(tableId:String, columnId:String, partialSchema:Object)`](#flysqlcheckschemacolumnvaliditytableidstring-columnidstring-partialschemaobject)
  - [`Flysql.checkSchemaTableValidity(tableId:String, partialSchema:Object)`](#flysqlcheckschematablevaliditytableidstring-partialschemaobject)
  - [`Flysql.checkSchemaValidity(schema:Object)`](#flysqlcheckschemavalidityschemaobject)
  - [`Flysql.escapeId(id:String):String`](#flysqlescapeididstringstring)
  - [`Flysql.escapeValue(value:String|Number):String`](#flysqlescapevaluevaluestringnumberstring)
  - [`Flysql.padLeft(txt:String, len:Number, filler:String = "0"):String`](#flysqlpadlefttxtstring-lennumber-fillerstring--0string)
  - [`Flysql.normalizeDate(dateObject:Date):String`](#flysqlnormalizedatedateobjectdatestring)
  - [`Flysql.normalizeMoment(dateObject)`](#flysqlnormalizemomentdateobject)
  - [`Flysql.constructor(options:Object = {}):Flysql`](#flysqlconstructoroptionsobject--flysql)
  - [`flysql.trace(msg:String, argz:Array = [])`](#flysqltracemsgstring-argzarray--)
  - [`flysql.checkInstanceValidity(table:String, item:Object)`](#flysqlcheckinstancevaliditytablestring-itemobject)
  - [`flysql.copyObject(data)`](#flysqlcopyobjectdata)
  - [`flysql.addSchema(schema:Object)`](#flysqladdschemaschemaobject)
  - [`flysql.getSchema()`](#flysqlgetschema)
  - [`flysql.connect()`](#flysqlconnect)
  - [`flysql.disconnect()`](#flysqldisconnect)
  - [`flysql.selectMany(table:String, filters:Array)`](#flysqlselectmanytablestring-filtersarray)
  - [`flysql.selectOne(table:String, id:String|Number)`](#flysqlselectonetablestring-idstringnumber)
  - [`flysql.insertMany(table:String, registers:Array)`](#flysqlinsertmanytablestring-registersarray)
  - [`flysql.insertOne(table:String, register:Object)`](#flysqlinsertonetablestring-registerobject)
  - [`flysql.updateMany(table:String, filters:Array, values:Object)`](#flysqlupdatemanytablestring-filtersarray-valuesobject)
  - [`flysql.updateOne(table:String, id:String|Number, values:Object)`](#flysqlupdateonetablestring-idstringnumber-valuesobject)
  - [`flysql.deleteMany(table:String, filters:Array)`](#flysqldeletemanytablestring-filtersarray)
  - [`flysql.deleteOne(table:String, id:String|Number)`](#flysqldeleteonetablestring-idstringnumber)
  - [`flysql.addTable(table:String, partialSchema:Object)`](#flysqladdtabletablestring-partialschemaobject)
  - [`flysql.addColumn(table:String, column:String, partialSchema:Object)`](#flysqladdcolumntablestring-columnstring-partialschemaobject)
  - [`flysql.renameTable(table:String, newName:String)`](#flysqlrenametabletablestring-newnamestring)
  - [`flysql.renameColumn(table:String, column:String, newName:String)`](#flysqlrenamecolumntablestring-columnstring-newnamestring)
  - [`flysql.dropTable(table:String)`](#flysqldroptabletablestring)
  - [`flysql.dropColumn(table:String, column:String)`](#flysqldropcolumntablestring-columnstring)
  - [`flysql.insertSql(sql:String)`](#flysqlinsertsqlsqlstring)
  - [`flysql.runSql(sql:String)`](#flysqlrunsqlsqlstring)
  - [`flysql.fetchSql(sql:String)`](#flysqlfetchsqlsqlstring)
  - [`flysql.reloadSchema()`](#flysqlreloadschema)
- [API no pública](#api-no-pública)
  - [`flysql._addTable(table:String, partialSchema)`](#flysql_addtabletablestring-partialschema)
  - [`flysql._addColumn(table:String, column, partialSchema)`](#flysql_addcolumntablestring-column-partialschema)
  - [`flysql._renameTable(table:String, newName)`](#flysql_renametabletablestring-newname)
  - [`flysql._renameColumn(table:String, column, newName)`](#flysql_renamecolumntablestring-column-newname)
  - [`flysql._dropTable(table)`](#flysql_droptabletable)
  - [`flysql._dropColumn(table:String, column)`](#flysql_dropcolumntablestring-column)
  - [`flysql._ensureBasicMetadata()`](#flysql_ensurebasicmetadata)
  - [`flysql._persistSchema()`](#flysql_persistschema)
  - [`flysql._loadSchema()`](#flysql_loadschema)
  - [`flysql._sqliteTypeFromColumnSchema(columnSchema)`](#flysql_sqlitetypefromcolumnschemacolumnschema)
  - [`flysql._sqliteCreateTableFromTableSchema(table:String, partialSchema)`](#flysql_sqlitecreatetablefromtableschematablestring-partialschema)
  - [`flysql._sqliteSelectFrom(table)`](#flysql_sqliteselectfromtable)
  - [`flysql._sqliteInsertInto(table:String, columnIds)`](#flysql_sqliteinsertintotablestring-columnids)
  - [`flysql._sqliteInsertValues(registers:Array, columnIds)`](#flysql_sqliteinsertvaluesregistersarray-columnids)
  - [`flysql._sqliteUpdateSet(table:String, values)`](#flysql_sqliteupdatesettablestring-values)
  - [`flysql._sqliteWhere(whereRules, includeWhereKeyword = true)`](#flysql_sqlitewherewhererules-includewherekeyword--true)
  - [`flysql._sqliteDeleteFrom(table)`](#flysql_sqlitedeletefromtable)
  - [`flysql._injectDefaultByJs(table:String, rows:Array<Object>)`](#flysql_injectdefaultbyjstablestring-rowsarrayobject)
- [Ejemplo](#ejemplo)

# Instalación

```sh
npm i -s @allnulled/flysql
```

# API

La API es totalmente síncrona debido a cómo funciona `better-sqlite3`.

## `Flysql.create(...args):Flysql`

Llama al `flysql.constructor` y devuelve la instancia.

## `Flysql.connect(...args):Flysql`

Llama al `flysql.constructor`, llama al `flysql.connect()` y devuelve la instancia.

## `Flysql.AssertionError:Function`

Clase de `Error` para las aserciones en tiempo de ejecución.

## `Flysql.assertion:Function`

Función para hacer aserciones.

## `Flysql.defaultOptions:Object`

Opciones por defecto pasadas al `constructor`. Las opciones son:

```js
{
  trace: false,
  traceSql: false,
  filename: path.resolve(process.cwd(), "db.sqlite")
}
```

## `Flysql.defaultDatabaseOptions:Object`

Opciones por defecto pasadas al `better-sqlite3`. Las opciones son:

```js
{
  readonly: false,
  fileMustExist: false,
  timeout: 5000,
  verbose: (...args) => { },
}
```

## `Flysql.knownTypes:Array`

Tipos válidos de columna.

```js
[
   "boolean",
   "integer",
   "real",
   "string",
   "blob",
   "numeric",
   "date",
   "datetime",
   "object",
   "array",
   "object-reference"
]
```

Al ser seleccionados con `selectOne` o `selectMany`:

- los tipo `boolean` serán pasados a `true` o `false`.
- los tipo `date` y `datetime` serán pasados a objetos `Date`.
- los tipo `object` y `array` serán pasados a objetos JSON.

## `Flysql.knownOperators`

Operadores válidos para los filtros en las consultas.

```js
[
  "<",
  "<=",
  ">",
  ">=",
  "=",
  "!=",
  "is in",
  "is not in",
  "is null",
  "is not null",
  "is like",
  "is not like"
]
```

## `Flysql.checkSchemaColumnValidity(tableId:String, columnId:String, partialSchema:Object)`

Método que comprueba la validez de una columna del `schema`.

Aquí, `partialSchema:Object` tiene que ser una columna en el `schema`.

Las propiedades válidas de columna son:

- `nullable:Boolean` - debe ser `true` o `false`. Por defecto es `false` siempre.
- `unique:Boolean` - debe ser `true` o `false`. Por defecto es `false` siempre.
- `defaultBySql:String` - debe ser el código SQL que quieres poner detrás de la instrucción `DEFAULT`.
   - se hace una inyección limpia en este campo.
   - esto significa que si quieres poner un string, debes incluir las comillas.
- `defaultByJs:String` - debe ser el código JS que quieres usar para inflar el valor de la columna cuando no aparece.
   - tiene prioridad sobre el valor que se inyectaría desde `defaultBySql`.
   - debe hacer un `return` con el valor final.
   - se hace un `new Function(...)` para evaluar el código.
   - se inyectan los parámetros:
      - `row:Object`: la row en cuestión.
      - `index:Number`: el índice de esta row.
- `type:String` - debe ser uno de los tipos válidos, los `Flysql.knownTypes`, que son:
   - `boolean`
   - `integer`
   - `real`
   - `string`
   - `blob`
   - `numeric`
   - `date`
   - `datetime`
   - `object`
   - `array`
   - `object-reference`

En el caso de `type: "string"` también:

- `maxLength:Integer` - máximo de longitud de una columna tipo texto.

En el caso de `type: "object-reference"` también:

- `referredTable:String` - **obligatorio**, la tabla referida mediante esta columna.

## `Flysql.checkSchemaTableValidity(tableId:String, partialSchema:Object)`

Método que comprueba la validez de una tabla del `schema`.

El objeto `partialSchema:Object` tiene que tener una propiedad `columns:Object` mínimo, aunque esté vacía.

## `Flysql.checkSchemaValidity(schema:Object)`

Método que comprueba la validez de un `schema`.

El objeto `schema` tiene que tener una propiedad `tables:Object` mínimo, aunque esté vacía.

## `Flysql.escapeId(id:String):String`

Método para escapar un identificador en `sql`.

## `Flysql.escapeValue(value:String|Number):String`

Método para escapar un valor en `sql`.

## `Flysql.padLeft(txt:String, len:Number, filler:String = "0"):String`

Método utilitario para llenar por la izquierda un texto hasta que llegue a cierta longitud.

## `Flysql.normalizeDate(dateObject:Date):String`

Método utilitario para transformar objetos `Date` a un formato de fecha (hasta día) homogéneo.

## `Flysql.normalizeMoment(dateObject)`

Método utilitario para transformar objetos `Date` a un formato de fecha (hasta milisegundos) homogéneo.

## `Flysql.constructor(options:Object = {}):Flysql`

Constructor de objetos `Flysql`.

El objeto `options:Object` se llena por defecto con estas propiedades:

```js
  static defaultOptions = {
    trace: false,
    traceSql: false,
    filename: path.resolve(process.cwd(), "db.sqlite")
    databaseOptions: {
      readonly: false,
      fileMustExist: false,
      timeout: 5000,
      verbose: (...args) => { },
    },
  };
```

Puedes sobreescribir cualquiera, incluso las de dentro de `databaseOptions`.

Además, el método incorporará las siguientes propiedades propias:

- `this.$database:Object = null`
- `this.$schema:Object`
- `this.$options:Object`

## `flysql.trace(msg:String, argz:Array = [])`

Método utilitario usado para los traceos.

## `flysql.checkInstanceValidity(table:String, item:Object)`

Método para comprobar si un objeto cumple con la interfaz esperada de una `table` del `schema`.

## `flysql.copyObject(data)`

Método utilitario que copia un objeto, usando `JSON.stringify + JSON.parse`.

## `flysql.addSchema(schema:Object)`

Método para añadir parte de un `schema` al `flysql.$schema`.

El objeto `schema:Object` debe contener mínimo una propiedad `tables:Object`.

## `flysql.getSchema()`

Método que devuelve el `flysql.$schema`.

## `flysql.connect()`

Método que abre la base de datos y sincroniza el `flysql.$schema`.

Debes tener en cuenta que `flysql.$schema` está dentro de la base de datos:

- En la tabla `Database_metadata`
- Con el `name = 'db.schema'`
- En formato JSON

De esta forma, se consigue tener acoplado a la base de datos, el `flysql.$schema` que va a validar las instancias y demás.

## `flysql.disconnect()`

Método que cierra la base de datos.

## `flysql.selectMany(table:String, filters:Array)`

Método para extraer filas de una tabla.

El objeto `filters:Object` acepta `Array<Array<String, String, Number|String|Array>>`. Concretamente son objetos así:

```js
flysql.selectMany("Nombre_de_tabla", [
  ["columna", "<operador>", "<comparador>"]
]);
```

Donde:

- `columna:String`: nombre de la columna de la tabla.
- `operador:String`: acepta uno de los `Flysql.knownOperators` que son:
   - `=`: es igual que
   - `!=`: no es igual que
   - `<`: es menor que
   - `<=`: es menor o igual que
   - `>`: es mayor que
   - `>=`: es mayor o igual que
   - `is null`: es nulo
      - aquí no hay comparador
   - `is not null`: no es nulo
      - aquí no hay comparador
   - `is in`: está entre
      - aquí el comparador tiene que ser un `Array<String|Number>`
   - `is not in`: no está entre
      - aquí el comparador tiene que ser un `Array<String|Number>`
   - `is like`: es como
      - aquí el comparador es un `String` que permite el caracter `%` como *cualquier texto*.
   - `is not like`: no es como
      - aquí el comparador es un `String` que permite el caracter `%` como *cualquier texto*.
- `comparador:String|Number|Array`: dependiendo del `operador` acepta unos u otros, y en el caso de `is null` e `is not null` no tiene relevancia este parámetro.

## `flysql.selectOne(table:String, id:String|Number)`

Método que permite extraer una fila concreta por su columna `id`.

## `flysql.insertMany(table:String, registers:Array)`

Método que permite insertar varias filas de una llamada.

El parámetro `registers:Array<Object>` acepta solamente un array de nuevas instancias.

Permite insertar los tipos siguientes directamente:

- Columnas `type:"boolean"` aceptan un booleano `true` o `false` directamente.
- Columnas `type:"date"` aceptan un objeto `Date` directamente.
- Columnas `type:"datetime"` aceptan un objeto `Date` directamente.
- Columnas `type:"object"` aceptan un `Object` directamente.
- Columnas `type:"array"` aceptan un `Array` directamente.

Lo mismo aplica para actualizar estos valores.

## `flysql.insertOne(table:String, register:Object)`

Método que permite insertar una fila.

El parámetro `register:Object` acepta solamente una nueva instancia.

## `flysql.updateMany(table:String, filters:Array, values:Object)`

Método que permite cambiar ciertas propiedades de varias filas de una llamada.

El parámetro `filters:Array` funciona igual que con `selectMany`.

El parámetro `values:Object` son las propiedades que se van a cambiar.

## `flysql.updateOne(table:String, id:String|Number, values:Object)`

Método que permite cambiar ciertas propiedades de una fila.

El parámetro `id:String|Number` es el `id` de la fila.

El parámetro `values:Object` son las propiedades que se van a cambiar.

## `flysql.deleteMany(table:String, filters:Array)`

Método que permite eliminar varias filas de una llamada.

El parámetro `filters:Array` funciona igual que con `selectMany`.

## `flysql.deleteOne(table:String, id:String|Number)`

Método que permite eliminar varias filas de una llamada.

El parámetro `id:String|Number` es el `id` de la fila.

## `flysql.addTable(table:String, partialSchema:Object)`

Método que añade una tabla en el `this.$schema` y sincroniza el `Database_metadata`.

El parámetro `partialSchema:Object` debe coincidir con la estructura que se espera de una tabla. Esto significa que, mínimo, tiene que tener la propiedad `column`.

## `flysql.addColumn(table:String, column:String, partialSchema:Object)`

Método que añade una columna en el `this.$schema` y sincroniza el `Database_metadata`.

El parámetro `partialSchema:Object` debe coincidir con la estructura que se espera de una columna.

## `flysql.renameTable(table:String, newName:String)`

Método que cambia el nombre de una tabla en el `this.$schema` y sincroniza el `Database_metadata`.

## `flysql.renameColumn(table:String, column:String, newName:String)`

Método que cambia el nombre de una columna en el `this.$schema` y sincroniza el `Database_metadata`.

## `flysql.dropTable(table:String)`

Método que elimina una tabla en el `this.$schema` y sincroniza el `Database_metadata`.

## `flysql.dropColumn(table:String, column:String)`

Método que elimina una columna en el `this.$schema` y sincroniza el `Database_metadata`.

## `flysql.insertSql(sql:String)`

Método que permite ejecutar `sql`, orientado a un *insert único o múltiple* y que devuelve el `lastInsertRowid` o identificador de la última fila insertada.

## `flysql.runSql(sql:String)`

Método que permite ejecutar `sql`, orientado a *múltiples instrucciones sql de una llamada*. No devuelve nada.

## `flysql.fetchSql(sql:String)`

Método que permite ejecutar `sql`, orientado a un *select* y que devuelve las filas seleccionadas.

## `flysql.reloadSchema()`

Método que sincroniza el `flysql.$schema` con el `db.schema` de la tabla `Database_metadata`.

# API no pública

Además de estos, hay una serie de métodos pensados para uso privado, pero que en esta documentación aparecen igualmente.

Estos métodos tienen la peculiaridad de comenzar siempre con `_`.

## `flysql._addTable(table:String, partialSchema)`

Método que añade una tabla con `sql`.

## `flysql._addColumn(table:String, column, partialSchema)`

Método que añade una columna con `sql`.

## `flysql._renameTable(table:String, newName)`

Método que renombra una tabla con `sql`.

## `flysql._renameColumn(table:String, column, newName)`

Método que renombra una columna con `sql`.

## `flysql._dropTable(table)`

Método que elimina una tabla.

## `flysql._dropColumn(table:String, column)`

Método que elimina una columna.

## `flysql._ensureBasicMetadata()`

Método que crea las tablas básicas para que `Flysql` funcione correctamente.

Por ahora, solo es `Database_metadata`.

## `flysql._persistSchema()`

Método que persiste el `this.$schema` en la tabla `Database_metadata`.

## `flysql._loadSchema()`

Método que carga el `this.$schema` de la tabla `Database_metadata`.

## `flysql._sqliteTypeFromColumnSchema(columnSchema)`

Método que devuelve el código `sql` correspondiente al tipo de una columna.

## `flysql._sqliteCreateTableFromTableSchema(table:String, partialSchema)`

Método que devuelve el código `sql` correspondiente a la creación de una tabla basándose en su definición del `flysql.$schema`.

## `flysql._sqliteSelectFrom(table)`

Método que devuelve el código `sql` correspondiente a `SELECT * FROM <tabla>`.

## `flysql._sqliteInsertInto(table:String, columnIds)`

Método que devuelve el código `sql` correspondiente a `INSERT INTO <tabla>`.

## `flysql._sqliteInsertValues(registers:Array, columnIds)`

Método que devuelve el código `sql` correspondiente a `VALUES (<fila>), (<fila>), ...`.

## `flysql._sqliteUpdateSet(table:String, values)`

Método que devuelve el código `sql` correspondiente a `UPDATE <tabla> SET <valores>`.

## `flysql._sqliteWhere(whereRules, includeWhereKeyword = true)`

Método que devuelve el código `sql` correspondiente a `WHERE <where rules>`.

## `flysql._sqliteDeleteFrom(table)`

Método que devuelve el código `sql` correspondiente a `DELETE FROM <tabla>`.

## `flysql._injectDefaultByJs(table:String, rows:Array<Object>)`

Método que inyecta el valor de la propiedad de columna `defaultByJs:String` a todos los rows del `insertOne` e `insertMany`.

# Ejemplo

```js
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
```

Otro ejemplo de cómo los tipos pueden usarse sería este otro test:

```js
module.exports = async function (Flysql) {

  const fs = require("fs");

  fs.unlinkSync(__dirname + "/test.sqlite");

  const { assertion } = Flysql;

  const flysql = Flysql.create({
    filename: "test.sqlite",
    trace: false,
    traceSql: false
  });
  flysql.connect();
  flysql.addSchema({
    tables: {
      Random_item: {
        columns: {
          booleanType: {type: "boolean"},
          stringType: {type: "string", maxLength: 10},
          textType: {type: "string"},
          integerType: {type: "integer"},
          realType: {type: "real"},
          blobType: {type: "blob"},
          dateType: {type: "date"},
          datetimeType: {type: "datetime"},
          objectType: {type: "object"},
          arrayType: {type: "array"},
        }
      }
    }
  });
  
  const item1 = flysql.insertOne("Random_item", {
    booleanType: false,
    stringType: "texto",
    textType: "texto",
    integerType: 1,
    realType: 1.55,
    blobType: "texto binario",
    dateType: new Date("2025-01-01"),
    datetimeType: new Date("2025-01-01 00:00:00"),
    objectType: {ok:200,message:"whatever intercaling ' quotes ' and ''two simple quotes''"},
    arrayType: [5,4,3,{message:"whatever"}],
  });
  
  const item1data = flysql.selectOne("Random_item", item1);

  assertion(item1data.booleanType === false);
  assertion(item1data.stringType === "texto");
  assertion(item1data.integerType === 1);
  assertion(item1data.realType === 1.55);
  assertion(item1data.blobType === "texto binario");
  assertion(item1data.dateType instanceof Date);
  assertion(item1data.datetimeType instanceof Date);
  assertion(Flysql.fromDateToDateSql(item1data.dateType) === "2025-01-01");
  assertion(Flysql.fromDateToDatetimeSql(item1data.datetimeType) === "2025-01-01 00:00:00");
  assertion(typeof item1data.objectType === "object");
  assertion(item1data.objectType.ok === 200);
  assertion(Array.isArray(item1data.arrayType));
  assertion(item1data.arrayType[0] === 5);
  assertion(item1data.arrayType[1] === 4);
  assertion(item1data.arrayType[2] === 3);

  console.log("[*] Completado test: 011.datatypes");

};
```