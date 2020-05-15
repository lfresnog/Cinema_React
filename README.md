# Cinema_React


# Frontend:


API: The movie DataBase, to use films and actors data -> https://api.themoviedb.org/3/discover/movie


URL: YouTube, to view trailers-> https://www.youtube.com/embed/



We use to develop it Axios and we create it with reactJS.



# Backend:


Query:



    type Query{
     getUser(name:String!,token:ID!):User

     getId:[Int]
     getFechas(idFilm:Int!):[Fecha]
     getSalas(idFilm:Int!,fecha:String!,hora:String!):Cine

    }

Mutation:


    type Mutation{

      updateSala(idFilm:Int!,fecha:String!,hora:String!,butacas:[Int]!):Cine

      addUser(name: String!, mail:String!, password: String!):User!
      login(mail:String!,password:String!):User!
      logout(name:String!,token:ID!):User!
    }


We have also created a Type User to create de user data and Type fech to create the movie date deatails:





    type User{
      _id: ID!
      name: String!
      mail:String!
      password: String!
      token:ID!
      
    }

    type Fecha{

      fecha: String!
      hora: String!

    }


Other type that we use is Type Cine, to create our cine details:




    type Cine{

      idFilm: Int!
      fecha: String!
      hora: String!
      asientos: [Int]!

    }



