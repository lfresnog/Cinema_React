import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';

import "babel-polyfill";

//"mongodb+srv://sergio:123pez@cluster0-dikpx.gcp.mongodb.net/test?retryWrites=true&w=majority"

const usr = "sergio";
const pwd = "123pez";
const url = "cluster0-dikpx.gcp.mongodb.net/test?retryWrites=true&w=majority";

/**
 * Connects to MongoDB Server and returns connected client
 * @param {string} usr MongoDB Server user
 * @param {string} pwd MongoDB Server pwd
 * @param {string} url MongoDB Server url
 */
const connectToDb = async function(usr, pwd, url) {
  const uri = `mongodb+srv://${usr}:${pwd}@${url}`;
  
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  await client.connect();
  return client;
};

/**
 * Starts GraphQL server, with MongoDB Client in context Object
 * @param {client: MongoClinet} context The context for GraphQL Server -> MongoDB Client
 */
const runGraphQLServer = function(context) {
  const typeDefs = `
    type Query{

     getUser(name:String!,token:ID!):User
     
    }

    type Mutation{

      addUser(name: String!, password: String!):User!
      removeUser(name:String!,token:ID!):User
      login(name:String!,password:String!):User!
      logout(name:String!,token:ID!):User!
    }

    type User{
      _id: ID!
      name: String!
      password: String!
      token:ID!
      
    }

  `;

  //el id de la factura es el id del titular

  const resolvers = {

    

    Query: {
 
      getUser: async (parent, args, ctx, info) => {

        const { name,token } = args;
        const { client } = ctx;
        const db = client.db("Cinema");
        const collection = db.collection("users");

        //buscar el usuario por username
        //obtener su token y comparar por el que se ha añadido
        //devolver lista de facturas por id, comparandolo por el id del usuario
        //las facturas tienen el id del user

        // const result = await collection.find({}).toArray();
        // return result;

        

        const exist = await collection.findOne({name:name});


        if(exist.token == token){
          return exist;
        }

      },
      
    },

    Mutation: {

      addUser: async (parent, args, ctx, info) => {

        const { name, password } = args;
        const { client } = ctx;
        const db = client.db("Cinema");
        const collection = db.collection("users");

        const exist = await collection.findOne({name:name});

        if(!exist){

          const token = uuid.v4();

          const result = await collection.insertOne({ name, password ,token});

          return {
            name,
            password,
            token,
            _id: result.ops[0]._id
          };
        }

      },
    
      login: async (parent, args, ctx, info) => {

        const {name, password} = args;
        const {client} = ctx;
        const db = client.db("Cinema");

        const collection = db.collection("users");
        const usuario1 = await collection.findOne({name: name, password: password});
        if(!usuario1){
          throw new Error(`Usuario o contrasena incorrectos`)
        }else{
          await collection.updateOne({"name": name }, { $set: { "token": uuid.v4() }});
        }  
        return await collection.findOne({name: name});
      },

      logout: async (parent, args, ctx, info) => {
        const {name, token} = args;
        const {client} = ctx;
        const db = client.db("Cinema");

        const collection = db.collection("users");
        const usuario1 = await collection.findOne({name: name, token: token});
        if(!usuario1){
          throw new Error(`Usuario no logeado`)
        }else{
          await collection.updateOne({ "name": name }, { $set: { "token": null }});
        }
        return await collection.findOne({name: name});

      },


      removeUser: async (parent, args, ctx, info) => {

        //removeUser(name:String!,token:ID!):Titulares
        const {name, token} = args;
        const { client } = ctx;
        const db = client.db("Cinema");
        let collection = db.collection("users");
        const exist = await collection.findOne({name:name});

        
        if(exist.token == token){
        
        await collection.deleteOne({name:{$eq:name}}); 

        collection = db.collection("facturas");
        await collection.remove({idFactura:{$eq:exist._id}},false);

        return exist;

        }

      },

      

    }
  };

  const server = new GraphQLServer({ typeDefs, resolvers, context });
  const options = {
    port: 8001
  };

  try {
    server.start(options, ({ port }) =>
      console.log(
        `Server started, listening on port ${port} for incoming requests.`
      )
    );
  } catch (e) {
    console.info(e);
    server.close();
  }
};

const runApp = async function() {
  const client = await connectToDb(usr, pwd, url);
  console.log("Connect to Mongo DB");
  try {
    runGraphQLServer({ client });
  } catch (e) {
    console.log(e);
    client.close();
  }
};

runApp();
