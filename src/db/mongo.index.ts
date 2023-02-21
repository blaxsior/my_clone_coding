import {MongoClient} from 'mongodb';
import KEY from '../util/key.js';

const client = new MongoClient(`mongodb+srv://${KEY.DB.mongodb.USER}:${KEY.DB.mongodb.PASSWORD}@node-mongo.no4qmpi.mongodb.net/${KEY.DB.mongodb.DB}?retryWrites=true&w=majority`);

export const mongodb = client.db();

export async function mongodbConn() {
    await client.connect();
}