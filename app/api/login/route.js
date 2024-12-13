const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('@/config/prisma');

const loginHandler = async (req, res) => {
    try {
        const appSecret = req.headers['x-app-secret'];
        const appOrigin = req.headers['x-app-origin'];
        console.log("Login headers:", appSecret, appOrigin);

        if (appSecret !== process.env.USER_DEFAULT_PASSWORD || appOrigin !== 'admin-frontend') {
            return res.status(403).json({ error: "Unauthorized request origin" });
        }

        const { username, password } = req.body;
        const user = await prisma.user.findUnique({
            where: {
                userId: username
            }
        });
        
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const isPasswordValid = user.password === password;
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Invalid password" });
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || '',
            { expiresIn: '30d' }
        );

        res.cookie('token', token, { httpOnly: true, sameSite: 'strict' });
        res.cookie('userId', user.id.toString(), { httpOnly: true, sameSite: 'strict' });

        const newUser = {
            id: user.id,
            userId: user.userId,
            displayName: user.displayName,
        };

        return res.json({ newUser, token });
    } catch (error) {
        console.error("Login error:", error);
        return res.status(500).json({ error: "An error occurred during login" });
    }
};

module.exports = loginHandler;
