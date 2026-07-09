import 'reflect-metadata'
import { config } from 'dotenv'
import path = require("node:path");


config({ path: path.resolve(__dirname, '../.env.test'), override: true})
