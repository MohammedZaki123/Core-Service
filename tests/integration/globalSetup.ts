import {config} from 'dotenv';
import path from 'path';

config({path: path.resolve(__dirname, '../../.env.test')});

export default async function globalSetup() {
    try{
        const {db} = require('../../src/lib/knex/knex');
        await db.migrate.latest();
    }catch(e){
        console.error(e);
    }
}