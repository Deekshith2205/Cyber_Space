const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const normalizeEmails = async () => {
    try {
        const mongoURI = process.env.MONGODB_URI;
        if (!mongoURI) {
            console.error('MONGODB_URI not found in backend/.env');
            process.exit(1);
        }

        await mongoose.connect(mongoURI);
        console.log('Connected to MongoDB');

        const db = mongoose.connection.db;
        const users = await db.collection('users').find({}).toArray();
        console.log(`Found ${users.length} users in 'users' collection`);

        for (const user of users) {
            if (!user.email) continue;
            
            const normalized = user.email.trim().toLowerCase();
            if (user.email !== normalized) {
                await db.collection('users').updateOne(
                    { _id: user._id },
                    { $set: { email: normalized } }
                );
                console.log(`Normalized email: ${user.email} -> ${normalized}`);
            }
        }

        console.log('Done');
        process.exit(0);
    } catch (error) {
        console.error('Error during normalization:', error);
        process.exit(1);
    }
};

normalizeEmails();
