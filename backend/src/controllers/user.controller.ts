import type { Context } from 'hono';
import { Prisma } from '../generated/prisma/index.js';
import * as userModel from '../models/user.model.js';
import { generateToken,verifyToken } from '../utils/jwtToken.js';
import bcrypt from 'bcrypt'


export const getUserById = async (c: Context) => {
  const idParam = c.req.param('id');
  const userId = parseInt(idParam, 10);

  if (isNaN(userId)) {
    return c.json({ error: 'Invalid user ID format' }, 400);
  }

  try {
    const user = await userModel.findUserById(userId);
    if (!user) {
      return c.json({ error: 'User not found' }, 404);
    }
    return c.json(user);
  } catch (error: any) {
    console.error('Error fetching user:', error);
    return c.json({ error: 'Failed to fetch user' }, 500);
  }
};


export const Login = async (c: Context) => {
  try {
    const body = await c.req.json();
    const {username,password,rememberMe} = body;
    if(!username || !password){
      return c.json({
        error: "Missing username or password." 
      },400)
    }
    const User = await userModel.getuserByUsername(username);
    if(!User){
      return c.json({
        errror: "Invalid username or password, please try again."
      },401)
    }
    const user = await userModel.loginUserModel(username,password);
    if(!user){
      return c.json({
        error: "Invalid username or password.",
        user:user
      },401)
    }
    //cookie
    const expiresIn = rememberMe ? "7d" : "1d";
    
    const token = generateToken({ id: user.id }, expiresIn);
    let cookie = `userToken=${token}; HttpOnly; Path=/; SameSite=Strict`;
    if (rememberMe) {
      const maxAge = 60 * 60 * 24 * 7;
      cookie += `; Max-Age=${maxAge}`;
    }
    c.header("Set-Cookie", cookie);
    return c.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    return c.json({ error: "Internal server error." }, 500);
  }
};

// Create user without auth (e.g., for admin panel)
export const createUser = async (c: Context) => {
  try {
    const body = await c.req.json();
      if(!body.username || !body.password){
          return c.json({
              error: "Missing username, password or email."
          },400);
      }
      const newUser = await userModel.createUserModel(body.username,body.password);
      const token = generateToken({ id: newUser.id },"1d");
      c.header('Set-Cookie', `userToken=${token}; HttpOnly; Path=/; Max-Age=86400; SameSite=Strict`);
      return c.json({
          success: true,
          message: "User created",
          user: newUser
      })
  } catch (error) {
      console.error("Create user error:",error)
        return c.json({
            error: "Internal server error"
        },500)
  }
};

// Delete user by ID
export const deleteUser = async (c: Context) => {
  try {
    const user = c.get("user");
    const userId = user.id;
    const deleteUser = await userModel.deleteUserModel(userId);
    if(!deleteUser){
      return c.json({
        error: "Fail to delete user's account."
      },400)
    }
    return c.json({
      message: "Delete account successful.",
      isDeleted: true,
      user: deleteUser
    })
  } catch (error) {
    console.log(error);
    return c.json({
      error: "Internal server error"
    },500)
  }
};

// Update user by ID (username/password)
export const updateUsername = async (c: Context) => {
  try {
    const body = await c.req.json();
    const user = c.get("user");
    const userId = user.id;
    if(!body.newUsername){
      return c.json({
        error: "New username is required."
      },400)
    }
    const updateUsername = await userModel.updateUsername(userId,body.newUsername);
    return c.json({
      message: "Username updated successfully.",
      user: {
        id:updateUsername.id,
        username:updateUsername.username
      }
    })
  } catch (error) {
    console.error("Update username error:",error)
    return c.json({
      error: "Internal server error",
    },500)
  }
};

// Update password only
export const updatePassword = async (c: Context) => {
  try {
        const body = await c.req.json();
        const user = c.get("user");
        const userId = user.id;
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
            return c.json({ error: "Current and new password are required." }, 400);
        }
        const foundUser = await userModel.findUserById(userId);
        if (!foundUser) {
            return c.json({ error: "User not found." }, 404);
        }
        const isMatch = await bcrypt.compare(currentPassword, foundUser.password);
        if (!isMatch) {
            return c.json({ 
                error: "Current password is incorrect.",
                isMatch: false,
            }, 401);
        }
        await userModel.updatePassword(userId, newPassword);
        return c.json({ message: "Password updated successfully." });
    } catch (error) {
        console.error("Update password error:", error);
        return c.json({ error: "Internal server error." }, 500);
    }
};

//to log out
export const logoutUser = async(c:Context)=>{
   try {
      c.header("Set-Cookie","userToken=; HttpOnly; Path=/; Max-Age=0; SameSite=Strict")
      return c.json({
        message: "Logged out successfully."
      })
    }catch (error) {
      console.error("Logout error:",error);
      return c.json({
        error: "Internal server error."
      },500)
    }
}

//decode cookie
export const decodeCookie = async(c:Context)=> {
    try {
    const token = c.req.header('cookie')?.match(/userToken=([^;]+)/)?.[1];
    if (!token) return c.json({ loggedIn: false }, 200);

    const payload = verifyToken(token); 
    if (!payload) return c.json({ loggedIn: false }, 200);

    const user = await userModel.findUserById(payload.id);
    if (!user) return c.json({ loggedIn: false }, 200);

    return c.json({
      loggedIn: true,
      user: { id: user.id, username: user.username, totalScore:user.totalScore},
    }, 200);
      
  } catch {
    return c.json({ loggedIn: false }, 200);
  }
}

