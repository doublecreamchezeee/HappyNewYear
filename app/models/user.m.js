const fs = require('fs');
const path = require('path');

const usersFilePath = path.join(__dirname,'../../db/users.json');

module.exports = {
    add: async (userData) => {
        try {
            const users = require(usersFilePath);
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

            fs.writeFileSync(usersFilePath, JSON.stringify(users,null,2));
        } catch(error){
            console.log(error);
            throw error;
        }
    },
    update: async function (un, name, password) {
        try {
            const users = require(usersFilePath);
            const user = await users.find(user => user.username === un);
            // TO DO: THÊM CHECK TOKEN PERMISSION
            if (user) {
                user.username = un;
                user.name = name;
                user.password = password;
                fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
            }
        } catch (error) {
            console.log(error);
        }
    },
    getAccount: async (username) => {
        try {
            const users = require(usersFilePath);
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
            const users = require(usersFilePath);
    
            const userIndex = users.findIndex((user) => user.username === username);
    
            if (userIndex !== -1) {
                // Nếu tìm thấy người dùng, cập nhật token
                users[userIndex].token = token;
    
                // Ghi lại vào tệp JSON
                fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
    
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
}