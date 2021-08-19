const mongoose = require('mongoose'); // npm i mongoose. Per fer servir el mongoDB


const dbConnection = async() => {

    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            useNewUrlParser: true, // Consultar documentació Mongoose
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });

        console.log('Base de datos online');


    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la BD');
    }

}


module.exports = {
    dbConnection: dbConnection
}