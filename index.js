import {gql, ApolloServer, UserInputError} from 'apollo-server'
import { v4 as uuidv4 } from 'uuid'

const persons = [
  {
    name:"adrian",
    phone:"789456123",
    street: "kakakaka",
    city: "babababa",
    id: "42467f98-e87b-41e1-9322-e5a80f2beab6"
  },
  {
    name:"antonio",
    phone:"789456123",
    street: "kakakaka",
    city: "babababsssssa",
    id: "42467f98-e87b-41e1-9322-e5a80f2beab8"
  },
  {
    name:"otro",
    street: "kakakaka",
    city: "babababa",
    id: "42467f98-e87b-41e1-9322-e5a80f2beab6asasas"
  }
]

// Describir datso en Graphql
// son las query que para ejecutar en el front
const typeDefs =  gql`

  enum YesNo {
    YES
    NO
  }

  type Person {
    name: String!
    phone: String
    address: Address!
    id: ID!
  }
  type Address {
    street: String!
    city: String!
  }

  type Query {
    personCount: Int!
    allPersons (phone:YesNo): [Person]!
    findPerson(name:String!): Person
  }
  type Mutation {
    addPerson(
      name:String!
      phone:String!
      street:String!
      city:String!
    ):Person
  }
`
// las operacion para obtener los resultados
const resolvers = {
  Query: {
    personCount: () => persons.length,
    allPersons:(root,args)=>{
      if(!args.phone) return persons

      return persons.filter(person =>( args.phone === "YES" ? person.phone : !person.phone))
    },
    findPerson:(root,args) =>{
      const { name } = args
      return persons.find(persons=>persons.name ===name)
    }
  },
  Mutation:{
    addPerson: (root, args)=>{
      if(persons.find(p=>p.name === args.name)){ // para comprobar
        throw new UserInputError('no puede haber 2',{
          invalidArgs: args.name
        })
      }
      const person = {...args,id:uuidv4()}
      persons.push(person)
      return person
    }
  },
  // pueden ser calculos o cualquier cosa para crear otro campos
  Person:{
    // root es la consulta anteriro
    address:(root)=> {
      return {
        street: root.street,
        city: root.city
      }
    },
  }
}

//Crear el servidor
// tiene que llamarse igual es decir typeDefs y resolvers
const server = new ApolloServer({
  typeDefs,
  resolvers
})

// iniciar el servidor
server.listen().then(({url})=>{
  console.log('servidor en el '+ url)
})

