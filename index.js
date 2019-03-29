const {
  ApolloServer,
  gql
} = require('apollo-server')
const axios = require('axios')

const typeDefs = gql `
  type Repo {
    desc: String
    forks: Int
    full_name: String
    stars: Int
  }
  type Pokemon {
    id: String!
    name: String!
    repo: Repo
  }
  # the schema allows the following query
  type Query {
    pokemons: [Pokemon]
    pokemon(id: String, name: String): Pokemon
  }
`

const resolvers = {
  Query: {
    pokemon: async (_, {
      id = '001',
      name
    }) => {

      let list = await axios.get(`https://cheeaun.github.io/repokemon/data/repokemon.min.json`).then(res => {
        return res.data
      })
      if (name) {
        return list.filter(item => item.name.toLocaleLowerCase() == name.toLocaleLowerCase())[0]
      }
      return list.filter(item => item.id == id)[0]
    },
    pokemons: async () => {
      let list = await axios.get(`https://cheeaun.github.io/repokemon/data/repokemon.min.json`).then(res => {
        return res.data
      })
      return list
    },

  }

}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  introspection: true,
  playground: true,
})

server.listen().then(({
  url
}) => {
  console.log(`🚀 Server ready at ${url}`)
})