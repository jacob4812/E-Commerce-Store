const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

  exports.registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
    
        
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "User already exists" });
        }
    
       
        const hashedPassword = await bcrypt.hash(password, 10);
    
        
        const newUser = new User({
          name,
          email,
          password: hashedPassword,
        });
    
        await newUser.save();
    
        
        const token = jwt.sign({ userId: newUser._id }, 'your_jwt_secret', { expiresIn: '1h' });
    
        res.status(201).json({ message: "User registered successfully", token });
      } catch (error) {
        res.status(500).json({ message: "Internal server error" });
      }
}
exports.loginUser = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }
  
     
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid password" });
      }
  
      
      const token = jwt.sign({ userId: user._id, userName: user.name }, 'your_jwt_secret', { expiresIn: '1h' });


  
      res.status(200).json({ message: "Login successful", token });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }

  exports.deleteUser = async (req, res) => {
    try {
      const userId = req.user.userId;
  
      
      await User.findByIdAndDelete(userId);
  
      res.status(200).json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  }
  exports.getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Internal server error" });
    }
  }

  exports.updateUser = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { name, currentPassword, newPassword } = req.body;
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      if (currentPassword && newPassword) {
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
          return res.status(400).json({ message: "Invalid current password" });
        }
  
        const hashedNewPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedNewPassword;
      }
  
      user.name = name || user.name;
      await user.save();
  
      res.status(200).json({ message: "Profile updated successfully", user: { name: user.name, email: user.email } });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: "Internal server error" });
    }
  }