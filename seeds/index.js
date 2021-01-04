const mongoose          = require('mongoose'),
cities                  = require('./cities'),
{ places, descriptors } = require('./seedHelpers'),
Campground              = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

//Returns a random element from the array
const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            price,
            description: 'Ribeye porchetta strip steak elit andouille short ribs dolor cow ipsum consequat exercitation laborum rump in. Enim salami in tenderloin swine. Quis sunt excepteur elit boudin filet mignon, flank capicola turkey. Pig esse ex, prosciutto alcatra jowl shankle quis excepteur cillum ground round dolore tail est beef ribs. Qui venison id ribeye, meatloaf ullamco culpa pork chop ea quis velit dolor. Short loin duis tenderloin sed, elit pork chop eu fugiat.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            user: '5ff1dd988c2c183a10e1d70a'
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})