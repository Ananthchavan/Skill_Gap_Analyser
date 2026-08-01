import passport from 'passport';
import { Strategy as GitHubStrategy } from 'passport-github2';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import User from './models/user.js';

function configurePassport() {

    //  GitHub Strategy (unchanged)
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
                authProvider: 'github',
            });
            const savedUser = await newUser.save();
            return done(null, savedUser);
        } catch (error) {
            console.error('Error during GitHub authentication', error);
            return done(error, null);
        }
    });

    // Override authorization params to force account picker
    githubStrategy.authorizationParams = function () {
        return { prompt: 'select_account' };
    };

    passport.use(githubStrategy);

    //  Local Strategy (email + password)
    passport.use(new LocalStrategy(
        { usernameField: 'email', passwordField: 'password' },
        async (email, password, done) => {
            try {
                const user = await User.findOne({ email: email.toLowerCase().trim(), authProvider: 'local' });

                if (!user) {
                    return done(null, false, { message: 'No account found with that email.' });
                }

                const isMatch = await bcrypt.compare(password, user.passwordHash);
                if (!isMatch) {
                    return done(null, false, { message: 'Incorrect password.' });
                }

                return done(null, user);
            } catch (error) {
                console.error('Error during local authentication', error);
                return done(error, null);
            }
        }
    ));

    //  Session serialization (shared)
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