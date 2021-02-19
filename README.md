# osa8

Uses dotenv, therefore library-backend requires mongo related variables to be defined in .env file (library-backend/.env), as well as a SECRET variable for jwt tokens, for example:

TEST_MONGODB_URI=mongodb://localhost/library
DEV_MONGODB_URI=mongodb://localhost/library
MONGODB_URI=mongodb+srv://[Inser specific Atlas URI to MongoDB here]retryWrites=true&w=majority
SECRET=JokuSalaisuus

One can get a set of initial database entries by executing a graphql-query:
mutation { 
  addTestBooks {
    title, 
    author {
      name, 
      bookCount
    }
  } 
}
