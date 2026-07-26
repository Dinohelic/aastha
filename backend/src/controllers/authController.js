import bcrypt from "bcrypt";
import prisma from "../config/prisma.js";
import generateToken from "../utils/generateToken.js";

/* =========================================
   LOGIN
========================================= */

export const login = async (req, res) => {

    try {

        const { identifier, password } = req.body;

        if (!identifier || !password) {
            return res.status(400).json({
                success: false,
                message: "Staff ID/Email and password are required."
            });
        }

        const user = await prisma.user.findFirst({
            where: {
                OR: [
                    { staffId: identifier },
                    { email: identifier }
                ]
            }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid Staff ID/Email."
            });
        }

        const isPasswordCorrect = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }

        const token = generateToken(user);

        res.json({
            success: true,
            message: "Login Successful",

            token,

            user: {
                id: user.id,
                staffId: user.staffId,
                fullName: user.fullName,
                email: user.email,
                phone: user.phone
            }
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};


/* =========================================
   GET CURRENT USER
========================================= */

export const getCurrentUser = async (req, res) => {

    try {

        const user = await prisma.user.findUnique({
            where: {
                id: req.user.id
            },
            select: {
                id: true,
                staffId: true,
                fullName: true,
                email: true,
                phone: true
            }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        res.json({
            success: true,
            user
        });

    } catch (error) {

        console.error(error);

        res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }

};