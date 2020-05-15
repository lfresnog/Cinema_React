import { MongoClient, ObjectID } from "mongodb";
import { GraphQLServer } from "graphql-yoga";
import *as uuid from 'uuid';

import "@babel/polyfill";

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

     getId:[Int]
     getFechas(idFilm:Int!):[Fecha]
     getSalas(idFilm:Int!,fecha:String!,hora:String!):Cine

    }
    type Mutation{

      updateSala(idFilm:Int!,fecha:String!,hora:String!,butacas:[Int]!):Cine

      addUser(name: String!, mail:String!, password: String!):User
      login(mail:String!,password:String!):User
      logout(name:String!,token:ID!):User
    }

    type User{

      
      name: String!
      mail:String!
      token:ID!
      error:String!
      
    }

    type Fecha{

      fecha: String!
      hora: String!

    }

    type Cine{

      idFilm: Int!
      fecha: String!
      hora: String!
      asientos: [Int]!

    }

  `;

  const resolvers = {


    Query: {
 
      getUser: async (parent, args, ctx, info) => {

        const { name,token } = args;
        const { client } = ctx;
        const db = client.db("Cinema");
        const collection = db.collection("users");


        const exist = await collection.findOne({name:name});


        if(exist.token == token){
          return exist;
        }

      },
      

      getId: async (parent, args, ctx, info) => {

        const { client } = ctx;
        const db = client.db("Cinema");
        const collection = db.collection("cine");
        
        let exist = await collection.find({}).toArray();
        let idFilms = [];

        exist.forEach(element => {
          
          idFilms.push(element.idFilm);

        });
        
        return idFilms;
      },

      getFechas:async (parent, args, ctx, info) => {


        const { idFilm } = args;
        const { client } = ctx;
        const db = client.db("Cinema");
        const collection = db.collection("cine");
        
        let exist = await collection.findOne({idFilm:idFilm});

        let fechas = [];
     
        
        exist.salas.forEach(elem =>{

          elem.fechas.forEach(el =>{

            fechas.push(el); 

          });

        });

        return fechas;

      },

      getSalas: async (parent, args, ctx, info) => {

      
        const { idFilm, fecha,hora } = args;
        const { client } = ctx;
        const db = client.db("Cinema");
        const collection = db.collection("cine");
        
        let exist = await collection.findOne({idFilm:idFilm});

        let sala = [];
        exist.salas.forEach(elem =>{

            elem.fechas.forEach(el =>{

              if(el.fecha == fecha && el.hora == hora){

                sala = el.asientos;

              }
              
            });

        });

        return {
          
          idFilm,
          fecha,
          hora,
          asientos:sala
        };
      },
    },

  
    Mutation: {

      updateSala:async (parent, args, ctx, info) => {

        const { idFilm, fecha,hora,butacas } = args;
        const {client} = ctx;
        const db = client.db("Cinema");

        const collection = db.collection("cine");

        let exist = await collection.findOne({idFilm:idFilm});

        let salas;

        if(exist){

          await collection.remove({idFilm:{$eq:idFilm}},false);

          salas = exist.salas;

          salas.forEach(elem =>{

            elem.fechas.forEach(el =>{

              if(el.fecha == fecha && el.hora == hora){

                console.log(butacas);
                el.asientos = butacas;

              }
              
            });

          });
        
        }


        await collection.insertOne({idFilm,salas});

        return{

          idFilm,
          fecha,
          hora,
          asientos:butacas

        };

      },

      addUser: async (parent, args, ctx, info) => {

        const { name, mail,password } = args;
        const { client } = ctx;
        const db = client.db("Cinema");
        const collection = db.collection("users");

        const exist = await collection.findOne({mail:mail});

        if(!exist){

          const token = uuid.v4();

          const result = await collection.insertOne({ name, mail,password ,token});

          setTimeout( () => {
            usersCollection.updateOne({"mail":mail}, {$set: {token:undefined}});
          }, 3000000)

          return {
            name,
            mail,
            token,
            error:""
          };


        }else{

          return {
            name: "",
            mail:"",
            token:"",
            error:"El correo usuario ya esta en uso"

          };

        }



      },
    
      login: async (parent, args, ctx, info) => {

        const {mail, password} = args;
        const {client} = ctx;
        const db = client.db("Cinema");

        const collection = db.collection("users");
        const usuario1 = await collection.findOne({mail: mail, password: password});
        if(!usuario1){
          
          return {
            
            
            name: "",
            mail:"",
            token:"",
            error:"Usuario o Contraseña incorrecta"

          };

        }else{

          await collection.updateOne({"mail": mail }, { $set: { "token": uuid.v4() }});
          setTimeout( () => {
            usersCollection.updateOne({"mail":mail}, {$set: {token:undefined}});
          }, 3000000)

          const user =  await collection.findOne({mail: mail});

          return {
              
            
            name: user.name,
            mail: user.mail,
            token:user.token,
            error:""

          };

        }  

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
      

    }
  };

  const server = new GraphQLServer({ typeDefs, resolvers, context });
  const options = {
    port: 8002
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