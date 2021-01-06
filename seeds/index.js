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
    for (let i = 0; i < 500; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                        {
                            url: 'https://res.cloudinary.com/dz5k5z7x3/image/upload/v1609877210/YelpCamp/az6hbrxkzmjcjlr2ir6y.jpg',
                            filename: 'YelpCamp/az6hbrxkzmjcjlr2ir6y'
                        },
                        {
                            url: 'https://res.cloudinary.com/dz5k5z7x3/image/upload/v1609877210/YelpCamp/fu4quk8pmhi3lurnzrns.jpg',
                            filename: 'YelpCamp/fu4quk8pmhi3lurnzrns'
                        },
                        {
                            url: 'https://res.cloudinary.com/dz5k5z7x3/image/upload/v1609877210/YelpCamp/rwfcaifvhx0sutnztrmz.jpg',
                            filename: 'YelpCamp/rwfcaifvhx0sutnztrmz'
                        },
                        {
                            url: 'https://res.cloudinary.com/dz5k5z7x3/image/upload/v1609877210/YelpCamp/y8msyfxxqslf6ge7iu7f.jpg',
                            filename: 'YelpCamp/y8msyfxxqslf6ge7iu7f'
                        }
            ],
            price,
            description: 'Ribeye porchetta strip steak elit andouille short ribs dolor cow ipsum consequat exercitation laborum rump in. Enim salami in tenderloin swine. Quis sunt excepteur elit boudin filet mignon, flank capicola turkey. Pig esse ex, prosciutto alcatra jowl shankle quis excepteur cillum ground round dolore tail est beef ribs. Qui venison id ribeye, meatloaf ullamco culpa pork chop ea quis velit dolor. Short loin duis tenderloin sed, elit pork chop eu fugiat.',
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            user: '5ff37ce777eb1f37082ea7d0',
            geometry: {
                type: 'Point',
                coordinates: [cities[random1000].longitude, cities[random1000].latitude]
            }
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})