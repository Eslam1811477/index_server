import { Router } from "express";
import templates from "./templates/index.js"
import userRouts from './user/index.js'
import admin from './admin/index.js'
var collectionRouts = Router()

collectionRouts.get('/', (req, res) => {
    res.send('server running successfully')
})
collectionRouts.use(templates)
collectionRouts.use(userRouts)
collectionRouts.use('/admin',admin)
export default collectionRouts;