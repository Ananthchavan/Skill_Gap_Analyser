import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from './models/User.js';

function configurePassport() {
    const githubStrategy = new GitHubStrategy({
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: process.env.GITHUB_CALLBACK_URL,
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            let user = await User.findOne({ githubId: profile.id });

            if (user) {
                user.accessToken = accessToken;
                await user.save();
                return done(null, user);
            }

            const newUser = new User({
                githubId: profile.id,
                username: profile.username,
                email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null,
                avatarUrl: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
                profileUrl: profile.profileUrl,
                accessToken: accessToken,
                refreshToken: refreshToken,
            });
            const savedUser = await newUser.save();
            return done(null, savedUser);
        } catch (error) {
            console.error('Error during GitHub authentication', error);
            return done(error, null);
        }
    }
    );

    // Override authorization params to use prompt=select_account 
    githubStrategy.authorizationParams = function (options) {
        return { prompt: 'select_account' };
    };

    passport.use(githubStrategy);

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            done(error, null);
        }
    });
}

export { passport, configurePassport };
export default passport;