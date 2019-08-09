// const User = require('./UserModel');

// const resolvers = {
//   saveGroup: async (_, { name }) => {
//     if (!name) return { code: 400, error: 'Name not supplied!' };

//     try {
//       const group = await User.findOne({ name });

//       if (!group) {
//         await group.save();
//       }

//       return { code: 200, group, error: '' };
//     } catch (error) {
//       return { code: 400, error: 'An error occurred, please try again later' };
//     }
//   },
//   addRepository: async (_, { name }) => {
//     if (!name) return { code: 400, error: 'Name not supplied!' };

//     try {
//       const User = await User.findOrCreate({ name });

//       return { code: 200, group, error: '' };
//     } catch (error) {
//       return { code: 400, error: 'An error occurred, please try again later' };
//     }
//   },
// };

// module.exports = resolvers.saveGroup;
