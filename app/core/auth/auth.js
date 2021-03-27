const {users} = require('../../data/users.js')

var user = null;

const authenticate = (username, password)=>{
    var user = users.find((user)=>{
        return user.username === username && user.password === password
    })
        
    return user
}


exports.authenticate = authenticate;