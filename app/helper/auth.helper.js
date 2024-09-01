const bcryptjs = require('bcryptjs');


const hashPassword = async (password) => {
    try {
        const saltPassword = 10;
        const hashPassword = await bcryptjs.hash(password, saltPassword);

        return hashPassword;
    } catch (error) {
        console.log("error: ", error);
        
    }
}

const comparePassword = async (password, hashPassword) => {
    try {
        return bcryptjs.compare(password, hashPassword);
    } catch (error) {
        console.log("error: ", error);
        
    }
}



module.exports = {hashPassword, comparePassword};