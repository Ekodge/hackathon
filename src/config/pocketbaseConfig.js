import PocketBase from 'pocketbase';
import {config} from 'dotenv';

// Load the .env file
config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

await pb.collection('_superusers').authWithPassword
(
    process.env.SUPERUSER_EMAIL,
    process.env.SUPERUSER_PASSWORD,
    {autoRefreshThreshold: 60 * 30}
);

export default pb;