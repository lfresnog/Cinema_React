"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var _mongodb = require("mongodb");

var _graphqlYoga = require("graphql-yoga");

var uuid = _interopRequireWildcard(require("uuid"));

require("babel-polyfill");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

//"mongodb+srv://sergio:123pez@cluster0-dikpx.gcp.mongodb.net/test?retryWrites=true&w=majority"
var usr = "sergio";
var pwd = "123pez";
var url = "cluster0-dikpx.gcp.mongodb.net/test?retryWrites=true&w=majority";
/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */

var connectToDb = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(usr, pwd, url) {
    var uri, client;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            uri = "mongodb+srv://".concat(usr, ":").concat(pwd, "@").concat(url);
            client = new _mongodb.MongoClient(uri, {
              useNewUrlParser: true,
              useUnifiedTopology: true
            });
            _context.next = 4;
            return client.connect();

          case 4:
            return _context.abrupt("return", client);

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  return function connectToDb(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();
/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */


var runGraphQLServer = function runGraphQLServer(context) {
  var typeDefs = "\n    type Query{\n\n     getUser(name:String!,token:ID!):User\n    }\n\n    type Mutation{\n\n      addUser(name: String!, password: String!):User!\n     \n\n      removeUser(name:String!,token:ID!):User\n      \n\n      login(name:String!,password:String!):User!\n      logout(name:String!,token:ID!):User!\n    }\n\n    type User{\n      _id: ID!\n      name: String!\n      password: String!\n      token:ID!\n      \n    }\n\n    \n\n  "; //el id de la factura es el id del titular

  var resolvers = {
    Query: {
      getUser: function () {
        var _getUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(parent, args, ctx, info) {
          var name, token, client, db, collection, exist;
          return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
              switch (_context2.prev = _context2.next) {
                case 0:
                  name = args.name, token = args.token;
                  client = ctx.client;
                  db = client.db("Cinema");
                  collection = db.collection("users"); //buscar el usuario por username
                  //obtener su token y comparar por el que se ha añadido
                  //devolver lista de facturas por id, comparandolo por el id del usuario
                  //las facturas tienen el id del user
                  // const result = await collection.find({}).toArray();
                  // return result;

                  _context2.next = 6;
                  return collection.findOne({
                    name: name
                  });

                case 6:
                  exist = _context2.sent;

                  if (!(exist.token == token)) {
                    _context2.next = 9;
                    break;
                  }

                  return _context2.abrupt("return", exist);

                case 9:
                case "end":
                  return _context2.stop();
              }
            }
          }, _callee2);
        }));

        function getUser(_x4, _x5, _x6, _x7) {
          return _getUser.apply(this, arguments);
        }

        return getUser;
      }()
    },
    Mutation: {
      addUser: function () {
        var _addUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(parent, args, ctx, info) {
          var name, password, client, db, collection, exist, token, result;
          return regeneratorRuntime.wrap(function _callee3$(_context3) {
            while (1) {
              switch (_context3.prev = _context3.next) {
                case 0:
                  name = args.name, password = args.password;
                  client = ctx.client;
                  db = client.db("Cinema");
                  collection = db.collection("users");
                  _context3.next = 6;
                  return collection.findOne({
                    name: name
                  });

                case 6:
                  exist = _context3.sent;

                  if (exist) {
                    _context3.next = 13;
                    break;
                  }

                  token = uuid.v4();
                  _context3.next = 11;
                  return collection.insertOne({
                    name: name,
                    password: password,
                    token: token
                  });

                case 11:
                  result = _context3.sent;
                  return _context3.abrupt("return", {
                    name: name,
                    password: password,
                    token: token,
                    _id: result.ops[0]._id
                  });

                case 13:
                case "end":
                  return _context3.stop();
              }
            }
          }, _callee3);
        }));

        function addUser(_x8, _x9, _x10, _x11) {
          return _addUser.apply(this, arguments);
        }

        return addUser;
      }(),
      login: function () {
        var _login = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(parent, args, ctx, info) {
          var name, password, client, db, collection, usuario1;
          return regeneratorRuntime.wrap(function _callee4$(_context4) {
            while (1) {
              switch (_context4.prev = _context4.next) {
                case 0:
                  name = args.name, password = args.password;
                  client = ctx.client;
                  db = client.db("Cinema");
                  collection = db.collection("users");
                  _context4.next = 6;
                  return collection.findOne({
                    name: name,
                    password: password
                  });

                case 6:
                  usuario1 = _context4.sent;

                  if (usuario1) {
                    _context4.next = 11;
                    break;
                  }

                  throw new Error("Usuario o contrasena incorrectos");

                case 11:
                  _context4.next = 13;
                  return collection.updateOne({
                    "name": name
                  }, {
                    $set: {
                      "token": uuid.v4()
                    }
                  });

                case 13:
                  _context4.next = 15;
                  return collection.findOne({
                    name: name
                  });

                case 15:
                  return _context4.abrupt("return", _context4.sent);

                case 16:
                case "end":
                  return _context4.stop();
              }
            }
          }, _callee4);
        }));

        function login(_x12, _x13, _x14, _x15) {
          return _login.apply(this, arguments);
        }

        return login;
      }(),
      logout: function () {
        var _logout = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(parent, args, ctx, info) {
          var name, token, client, db, collection, usuario1;
          return regeneratorRuntime.wrap(function _callee5$(_context5) {
            while (1) {
              switch (_context5.prev = _context5.next) {
                case 0:
                  name = args.name, token = args.token;
                  client = ctx.client;
                  db = client.db("Cinema");
                  collection = db.collection("users");
                  _context5.next = 6;
                  return collection.findOne({
                    name: name,
                    token: token
                  });

                case 6:
                  usuario1 = _context5.sent;

                  if (usuario1) {
                    _context5.next = 11;
                    break;
                  }

                  throw new Error("Usuario no logeado");

                case 11:
                  _context5.next = 13;
                  return collection.updateOne({
                    "name": name
                  }, {
                    $set: {
                      "token": null
                    }
                  });

                case 13:
                  _context5.next = 15;
                  return collection.findOne({
                    name: name
                  });

                case 15:
                  return _context5.abrupt("return", _context5.sent);

                case 16:
                case "end":
                  return _context5.stop();
              }
            }
          }, _callee5);
        }));

        function logout(_x16, _x17, _x18, _x19) {
          return _logout.apply(this, arguments);
        }

        return logout;
      }(),
      removeUser: function () {
        var _removeUser = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(parent, args, ctx, info) {
          var name, token, client, db, collection, exist;
          return regeneratorRuntime.wrap(function _callee6$(_context6) {
            while (1) {
              switch (_context6.prev = _context6.next) {
                case 0:
                  //removeUser(name:String!,token:ID!):Titulares
                  name = args.name, token = args.token;
                  client = ctx.client;
                  db = client.db("Cinema");
                  collection = db.collection("users");
                  _context6.next = 6;
                  return collection.findOne({
                    name: name
                  });

                case 6:
                  exist = _context6.sent;

                  if (!(exist.token == token)) {
                    _context6.next = 14;
                    break;
                  }

                  _context6.next = 10;
                  return collection.deleteOne({
                    name: {
                      $eq: name
                    }
                  });

                case 10:
                  collection = db.collection("facturas");
                  _context6.next = 13;
                  return collection.remove({
                    idFactura: {
                      $eq: exist._id
                    }
                  }, false);

                case 13:
                  return _context6.abrupt("return", exist);

                case 14:
                case "end":
                  return _context6.stop();
              }
            }
          }, _callee6);
        }));

        function removeUser(_x20, _x21, _x22, _x23) {
          return _removeUser.apply(this, arguments);
        }

        return removeUser;
      }()
    }
  };
  var server = new _graphqlYoga.GraphQLServer({
    typeDefs: typeDefs,
    resolvers: resolvers,
    context: context
  });
  var options = {
    port: 8001
  };

  try {
    server.start(options, function (_ref2) {
      var port = _ref2.port;
      return console.log("Server started, listening on port ".concat(port, " for incoming requests."));
    });
  } catch (e) {
    console.info(e);
    server.close();
  }
};

var runApp = /*#__PURE__*/function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
    var client;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return connectToDb(usr, pwd, url);

          case 2:
            client = _context7.sent;
            console.log("Connect to Mongo DB");

            try {
              runGraphQLServer({
                client: client
              });
            } catch (e) {
              console.log(e);
              client.close();
            }

          case 5:
          case "end":
            return _context7.stop();
        }
      }
    }, _callee7);
  }));

  return function runApp() {
    return _ref3.apply(this, arguments);
  };
}();

runApp();