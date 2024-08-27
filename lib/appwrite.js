import { Account, Avatars, Client, Databases, ID, Query } from 'react-native-appwrite';

export const config = {
  endpoint: 'https://cloud.appwrite.io/v1',
  platform: 'com.lcms.aora',
  projectId: '66cd2440001115e1a7c8',
  databaseId: '66cd26ed0027a340eaac',
  userCollectionId: '66cd2715001184c6f19a',
  videoCollectionId: '66cd272f0029db9cdfaa',
  storageId: '66cd282b0000745bb031'
}

// Init your React Native SDK
const client = new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

    const account = new Account(client);
    const avatars = new Avatars(client);
    const databases = new Databases(client);

    export const createUser = async (email, password, username) => {
      try {
        const newAccount = await account.create(
          ID.unique(),
          email,
          password,
          username
        )
        if (!newAccount) throw Error;

        const avatarUrl = avatars.getInitials(username);
        await signIn(email, password);

        const newUser = await databases.createDocument(
          config.databaseId,
          config.userCollectionId,
          ID.unique(),
          {
            accountId: newAccount.$id,
            email,
            username,
            avatar: avatarUrl
          }
        );
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }

    export const signIn = async (email, password) => {
      try {
        await account.deleteSession('current');
        const session = await account.createEmailPasswordSession(email, password);

        return session;
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }

    export const getCurrentUser = async () => {
      try {
        const currentAccount = await account.get();
        if (!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
          config.databaseId,
          config.userCollectionId,
          [Query.equal("accountId", currentAccount.$id)]
        )

        if (!currentUser) throw Error;

        return currentUser.documents[0];
      } catch (error) {
        console.log(error);
      }
    }


