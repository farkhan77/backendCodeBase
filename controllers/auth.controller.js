import User from '../models/user.model.js';
import bycrpt from "bcrypt";
import jwt from 'jsonwebtoken';
import createError from '../utils/CreateError.js';

export const register = async (req, res, next) => {
    try {
        const hash = bycrpt.hashSync(req.body.password, 10);
        const newUser = new User({
            ...req.body,
            password:hash
        })

        await newUser.save();
        res.status(201).send('User has been created!');
    } catch (error) {
        next(error);
    }
}

export const login = async (req, res, next) => {
    try {
        const user = await User.findOne({username: req.body.username});

        if (!user) return next(createError(404, 'User not found'));

        const isCorrect = bycrpt.compareSync(req.body.password, user.password);
        if (!isCorrect) return next(createError(400, 'Wrong password or username'));
        // if (!isCorrect) return res.status(400).send('Wrong password or username');

        const token = jwt.sign({
            id: user.id,
            isSeller: user.isSeller,
        }, process.env.JWT_KEY)

        const {password, ...info} = user._doc;
        res.cookie("accessToken", token, {httpOnly: true}).status(200).send(info);
    } catch (error) {
        res.next(error);
    }
}

export const logout = async (req, res) => {
    res.clearCookie('accessToken', {
        sameSite: 'none',
        secure: true,
    }).status(200).send('User has been logged out.');
}