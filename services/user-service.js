// alternative to mongoose, using the mongoclient from mongodb
const {MongoClient} = require("mongodb");
const bcrypt = require("bcryptjs");
const { create } = require("../models/user");

class UserService {
    constructor(){
        this.client = null;
        this.db = null;
        this.collection = null;
    }
    async connect(){
        try {
        this.client = await MongoClient.connect(
            process.env.MONGODB_URI ||"mongodb://127.0.0.1"
        );
        this.db = this.client.db("our_db");
        this.collection = this.db.collection("users");    
        } catch (error) {
            console.error("Database connection error", error);
            throw error;
        }
    }
    async disconnect(){
        if(this.client){
            await this.client.close();
        }
    }
    async hashPassword(password){
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt);
    }
    async createUser(userData){
        try { 
        const requiredFields = ["firstName", "lastName", "email", "password"];
        for (const field of requiredFields){
            if(!userData(field)){
                throw new Error(`${field} is required!`);
            }
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if(!emailRegex.test(userData.email)){
            throw new Error("Email invalid")
        }
        if(userData.password.length<6){
            throw new Error("Passsword must be at least 6 characters");
        }
        const userDoc = {
            firstName: userData.firstName.trim(),
            lastName: userData.firstName.trim(),
            email: userData.email.toLowerCase().trim(),
            password: await this.hashPassword(userData.password),
            role: userData.role || "level_one_user",
            createdAt: new Date(),
        };
        const validRoles = ["admin", "level_one_user", "level_two_user"];
        if(!validRoles.includes(userData.role)){
            throw new Error("role not valid")
        }
        const result = await this.collection.insertOne(userDoc)
        return {_id:result.insertedId, ...userDoc}
     } catch (error) {
            if(error.code===11000){
                throw new Error("Email already exist!")
            }
            throw Error
        }
    }
}

module.exports = userService