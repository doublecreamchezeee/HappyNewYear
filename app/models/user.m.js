const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname,'../../db/users.json');

module.exports = {
    add: async (userData) => {
        try {
            const users = require(usersFilePath).users;
            console.log("User count: ", users.length);
            const id = users.length + 1;
            const avatar = "";
            const token = "";
            const newUser = {
                id,
                username: userData.username,
                name: userData.name,
                password: userData.password,
                avatar,
                token,
            };
            users.push(newUser);
    
            fs.writeFileSync(usersFilePath, JSON.stringify({ users: users,onlineUser: users.online_users }, null, 2));
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    update: async function (un, name, password) {
        try {
            const users = require(usersFilePath).users;
            const userIndex = users.findIndex(user => user.username === un);
    
            if (userIndex !== -1) {
                // Nếu tìm thấy người dùng, cập nhật thông tin
                users[userIndex].username = un;
                users[userIndex].name = name;
                users[userIndex].password = password;
    
                fs.writeFileSync(usersFilePath, JSON.stringify({ users: users,onlineUser: users.online_users }, null, 2));
            }
        } catch (error) {
            console.log(error);
        }
    },
    getAccount: async (username) => {
        try {
            const users = require(usersFilePath).users;
            const user = users.find((user) => user.username === username);
    
            if (user) {
                // Trả về thông tin người dùng nếu tìm thấy
                return {
                    id: user.id,
                    username: user.username,
                    name: user.name,
                    password: user.password,
                    avatar: user.avatar,
                    token: user.token,
                };
            } else {
                // Trả về null nếu không tìm thấy người dùng
                return null;
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },  
    updateRefreshToken: async (username, token) => {
        try {
            const users = require(usersFilePath).users;
    
            const userIndex = users.findIndex((user) => user.username === username);
    
            if (userIndex !== -1) {
                // Nếu tìm thấy người dùng, cập nhật token
                users[userIndex].token = token;
    
                // Ghi lại vào tệp JSON
                fs.writeFileSync(usersFilePath, JSON.stringify({ users: users,onlineUser: users.online_users }, null, 2));

    
                // Trả về kết quả
                return { success: true };
            } else {
                // Nếu không tìm thấy người dùng
                return { success: false, message: 'User not found' };
            }
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    addOnlineList: async(username) => {
        try {
            // const users = require(usersFilePath);
            // const online_users = users.online_users;
            // online_users.push(username);
            // fs.writeFileSync(usersFilePath, JSON.stringify({ users: users.users,onlineUser: online_users }, null, 2));
        }
        catch (e){
            console.log(e);
            throw e;
        }
    },
    removeUserOnline: async (username) => {
        try {
            const users = require(usersFilePath);
            const online_users = users.online_users;
            
            const idx = online_users.findIndex((user) => user.username === username);
    
            if (idx !== -1) {
                // Nếu người dùng online được tìm thấy, loại bỏ khỏi mảng
                online_users.splice(idx, 1);
    
                // Ghi lại vào tệp JSON
                fs.writeFileSync(usersFilePath, JSON.stringify({ users: users.users, online_users }, null, 2));
            }
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    getOnlineUsers: async () => {
        try {
            const users = require(usersFilePath);
            const online_users = users.online_users;
    
            // Trả về danh sách người dùng đang online
            return online_users;
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
}