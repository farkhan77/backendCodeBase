import express from 'express';
import { createItem, deleteItem, getItem, getItems, updateItem } from '../controllers/item.controller.js';
import { verifyToken } from '../middleware/jwt.js';
// For crud file
import multer from 'multer';

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg'
}

// image upload
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype]
        let uploadError = new Error('Invalid image type')

        if (isValid) {
            uploadError = null
        }
        cb(uploadError, 'public/uploads')
    },
    filename: function (req, file, cb) {
        const extention = FILE_TYPE_MAP[file.mimetype]
        // const fileName = file.originalname.replace(' ', '-')
        const fileName = file.originalname.split(' ').join('-')
        cb(null, `${fileName}-${Date.now()}.${extention}`)
    }
})
const uploadOptions = multer({ storage: storage })

const router = express.Router();

router.get('/', getItems);
router.get('/:id', getItem);
router.post('/add', verifyToken, uploadOptions.single('image'), createItem);
router.put('/update/:id', verifyToken, uploadOptions.single('image'), updateItem);
router.delete('/delete/:id', verifyToken, deleteItem);

export default router;