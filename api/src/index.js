const {ApolloServer, ApolloError, gql} = require ("apollo-server");
const {MongoClient} = require ("mongodb");


const typeDefs = gql`
    type Contact {
        _id:ID!
        name: String!
        surname: String!
        email:String!
        phone: String!
    }

    type Query{
        getContacts: [Contact!]!
        getContactsAZ: [Contact!]!
        getContactsZA: [Contact!]!
    }

    type Mutation{
        addContact(name: String!, surname: String!, email: String!, phone: String!): Contact!
        deleteContact(email: String): String!
        editContact(email_antiguo:String!, name: String, surname: String, email: String, phone: String): Contact!
    }
`

const resolvers ={
    Query: {
        getContacts: async (parent,args,ctx) => {
            const db = ctx.db;
            return db.collection("contacts").find({}).toArray();
        },

        getContactsAZ: async (parent,args,ctx) => {
            const db = ctx.db;
            const sort={name: 1};
            return db.collection("contacts").find({}).sort(sort).toArray()
        },
        getContactsZA: async (parent,args,ctx) => {
            const db = ctx.db;
            const sort={name: -1};
            return db.collection("contacts").find({}).sort(sort).toArray()
        }
    },
    Mutation: {
        addContact: async (parent,args,ctx) => {
            const db = ctx.db;
            const {name, surname, email, phone} = args;
            const {insertedId} = await db.collection("contacts").insertOne({name,surname,email,phone});
            return {name,surname,_id:insertedId,email,phone};
        },
        deleteContact: async (parent,args,ctx) => {
            const db = ctx.db;
            const {email} = args;
            const {insertedId} = await db.collection("contacts").deleteOne({email});
            return "Contact deleted";
        },
        editContact: async (parent,args,ctx) => {
            const db = ctx.db;
            const {email_antiguo, name, surname,email,phone} = args;
        
            const exist = await db.collection("contacts").findOne({ email: email_antiguo });
        
            if (exist == null) {
                throw new ApolloError('Contacto no existe');
            } else {
                let newContact = {
                    name: name|| exist.name,
                    surname: surname||exist.surname,
                    email: email || exist.email,
                    phone: phone || exist.phone,
                }
        
                const filter = { email: email_antiguo };
                const updateDoc = {
                    $set: {
                        name: newContact.name,
                        surname: newContact.surname,
                        email: newContact.email,
                        phone: newContact.phone
                    }
                };
                await db.collection("contacts").updateOne(filter, updateDoc);
                return {name:newContact.name,surname:newContact.surname,_id:exist._id,email:newContact.email,phone:newContact.phone};
            }
        }
    }
}

const mongourl = process.env.MONGO_URL;
if(!mongourl) console.error("MONGO URL env variable not defined");
else{
    const client = new MongoClient(mongourl);
    try{
        client.connect().then(() => {
            console.log("Mongo DB connected");
            const server = new ApolloServer({
                typeDefs,
                resolvers,
                context: () => { return {db: client.db("test")}}
            });
            server.listen().then(({url})=>{
                console.log(`Servidor escuhando en ${url}`);
            })
        })
    } catch (e){
        console.error(e);
    }
}