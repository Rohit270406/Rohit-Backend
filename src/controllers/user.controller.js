import { User } from "../models/user.model.js";
const registerUser = async (req, res) => {
    try{
        const { fullName, email, username, password } = req.body;
        if(
            [fullName, email, username, password].some((field) => field?.trim() === "")
        ){
            return res.status(400).json({ error: "All fields are compulsory!" });
        }
        const existedUser = await User.findOne({
            $or: [{ username }, { email }]
        });

        if(existedUser){
            return res.status(409).json({ error: "Username or Email is already in use!" });
        }
            
        const user = await User.create({
            fullName,
            email,
            username: username.toLowerCase(),
            password
        });

        const createdUser = await User.findById(user._id).select("-password");
        if (!createdUser) {
            return res.status(500).json({ error: "Database is throwing error while saving!" });
        }
        return res.status(201).json({ 
            message: "User registered successfully!", 
            data: createdUser 
        });
    } catch (error) {
        console.log("Signup error occurs: ", error);
        res.status(500).json({ error: "Server is in problem!" });
    }
};

export { registerUser };
