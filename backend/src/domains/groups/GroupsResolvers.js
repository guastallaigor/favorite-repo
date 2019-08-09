const Groups = require('./GroupsModel');

const resolvers = {
  saveGroup: async (_, { name, user }) => {
    if (!name || !user) return { code: 400, error: 'Name not supplied!' };

    try {
      let group = await Groups.findOne({ name, user });

      if (group) {
        return { code: 400, error: 'Group already saved!' };
      }

      group = await Groups.create({ name, user });

      return { code: 200, group, error: '' };
    } catch (error) {
      return { code: 400, error: 'An error occurred, please try again later' };
    }
  },
  // addRepository: async (_, { name }) => {
  //   if (!name) return { code: 400, error: 'Name not supplied!' };

  //   try {
  //     const groups = await Groups.findOrCreate({ name });

  //     return { code: 200, group, error: '' };
  //   } catch (error) {
  //     return { code: 400, error: 'An error occurred, please try again later' };
  //   }
  // },
};

module.exports = resolvers.saveGroup;
