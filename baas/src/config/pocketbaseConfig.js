import PocketBase from 'pocketbase';
import {config} from 'dotenv';

// Load the .env file
config();

const pb = new PocketBase(process.env.POCKETBASE_URL);

export default pb;

//auth with auth.js