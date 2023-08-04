import Item from "../models/item.model.js";
import createError from "../utils/CreateError.js";
import * as fs from 'fs';

export const getItems = async (req, res, next) => {
    try {
        const items = await Item.find()

        if(!items) return next(createError(404, "Items not found!"))

        res.status(200).json(items)
    } catch (error) {
        next(error)
    }
}

export const getItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id)
        
        if(!item) return next(createError(404, "Item not found!"))

        res.status(200).json(item)
    } catch (error) {
        next(200)
    }
}

export const createItem = async (req, res, next) => {
    try {
        if (!req.isSeller) return next(createError(403, "Only seller can create an item!"))
        
        // image upload
        const fileName = req.file.filename
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`

        const newItem = new Item({
            userId: req.userId,
            image: `${basePath}${fileName}`,
            ...req.body
        })

        const saveItem = await newItem.save()
        console.log(saveItem)
        res.status(201).json(saveItem)    
    } catch (error) {
        next(error)
    }
}

export const updateItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id)
        
        if (!req.isSeller) return next(createError(403, "Only seller can update an item!"))
        else if (item.userId !== req.userId) return next(createError(403, "You can only update your own item!"))
        else if (!item) return next(createError(404, "Item not found"))

        let imagepath

        if (req.file) {
            const filePath = './public/uploads'
            const splittedFile = item.image.split('/')
            // console.log(`${filePath}/${splittedFile[splittedFile.length - 1]}`)
            fs.unlink(`${filePath}/${splittedFile[splittedFile.length - 1]}`, function(err) {
                if(err && err.code == 'ENOENT') {
                    // file doens't exist
                    console.info("File doesn't exist, won't remove it.");
                } else if (err) {
                    // other errors, e.g. maybe we don't have enough permission
                    console.error("Error occurred while trying to remove file");
                } else {
                    console.info(`removed`);
                }
            })
            const fileName = req.file.filename
            const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`
            imagepath = `${basePath}${fileName}`
        } else {
            imagepath = item.image
        }

        const updatedItem = await Item.findByIdAndUpdate(req.params.id, {
            image: imagepath,
            ...req.body
        }, {
            new: true
        })

        res.status(200).json(updatedItem)
    } catch (error) {
        next(error)
    }
}

export const deleteItem = async (req, res, next) => {
    try {
        const item = await Item.findById(req.params.id);

        if (!req.isSeller) return next(createError(403, "Only seller can delete an item!"))
        else if (item.userId !== req.userId) return next(createError(403, "You can only delete your own item!"))
        else if (!item) return next(createError(404, "Item not found"))

        const deletedItem = await Item.findByIdAndDelete(req.params.id)
        if (!deletedItem) return next(createError(404, "Item not found!"))

        const {image} = item
        const splittedUrl = image.split('/')
        const filePath = './public/uploads'

        fs.unlink(`${filePath}/${splittedUrl[splittedUrl.length - 1]}`, function(err) {
            if(err && err.code == 'ENOENT') {
                // file doens't exist
                console.info("File doesn't exist, won't remove it.");
            } else if (err) {
                // other errors, e.g. maybe we don't have enough permission
                console.error("Error occurred while trying to remove file");
            } else {
                console.info(`removed`);
            }
        })

        res.status(200).send("Item successfully deleted!")
    } catch (error) {
        next(error)
    }
}