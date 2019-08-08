const axios = require('axios');

const resolvers = {
  getRepositories: async (_, { name, page = 1, sort = 'stars', order = 'desc' }) => {
    if (!name) return { code: 400, error: 'Name not supplied!' };
    const params = { page: page, per_page: 9, q: name, order, sort };

    try {
      const { data } = await axios.get(
        'https://api.github.com/search/repositories',
        { params }
      );
      return { code: 200, total_count: data.total_count, items: data.items };
    } catch (error) {
      return { code: 400, error: 'An error occurred, please try again later' };
    }
  },
};

module.exports = resolvers.getRepositories;
