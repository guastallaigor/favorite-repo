const axios = require('axios')

const resolvers = {
  getRepositories: async (_, { name, page }) => {
    if (!name) return { code: 400, error: 'Name not supplied!' }
    const params = { page: page || 1, per_page: 9, q: name }

    try {
      const { data } = await axios.get(
        'https://api.github.com/search/repositories',
        { params }
      )
      return { code: 200, total_count: data.total_count, items: data.items }
    } catch (error) {
      return { code: 400, error: 'An error occurred, please try again later' }
    }
  },
}

module.exports = resolvers.getRepositories
