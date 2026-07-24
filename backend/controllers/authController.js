// <=================== AUTH CONTROLLER ===================>
// Handles HTTP request/response only.
// All business logic lives in authService.js.

/*
GET /api/current_user
Returns the currently authenticated user from the session.
*/
export const getCurrentUser = (req, res) => {
    if (!req.user) return res.status(401).json(null);
    res.status(200).json(req.user);
};

/*
GET /api/logout
logout the user
*/
export const logoutUser = (req, res) => {
    req.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).json({ error: 'Logout failed' });
        }
        res.redirect(process.env.CLIENT_URL);
    });
};
