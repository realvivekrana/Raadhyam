import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config({ path: './.env' });

// Only configure Google Strategy if ALL credentials are present
const clientId = process.env.GOOGLE_CLIENT_ID;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
const callbackUrl = process.env.GOOGLE_CALLBACK_URL;

console.log('Passport config check - GOOGLE_CLIENT_ID:', clientId ? 'set' : 'not set');
console.log('Passport config check - GOOGLE_CLIENT_SECRET:', clientSecret ? 'set' : 'not set');
console.log('Passport config check - GOOGLE_CALLBACK_URL:', callbackUrl ? 'set' : 'not set');

try {
  if (clientId && clientSecret && callbackUrl) {
    console.log('Configuring Google OAuth Strategy...');
    
    passport.use(
      new GoogleStrategy(
        {
          clientID: clientId,
          clientSecret: clientSecret,
          callbackURL: callbackUrl,
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            const User = (await import('../models/users.js')).default;
            
            let user = await User.findOne({ googleId: profile.id });
            if (user) return done(null, user);

            user = await User.findOne({ email: profile.emails[0].value });
            if (user) {
              user.googleId = profile.id;
              user.name = profile.displayName;
              user.avatar = profile.photos[0].value;
              await user.save();
              return done(null, user);
            }

            user = new User({
              googleId: profile.id,
              email: profile.emails[0].value,
              name: profile.displayName,
              avatar: profile.photos[0].value,
            });
            await user.save();
            done(null, user);
          } catch (error) {
            done(error, null);
          }
        }
      )
    );
    console.log('Google OAuth Strategy configured successfully');
  } else {
    console.log('Google OAuth credentials not fully configured - Google login disabled');
  }
} catch (err) {
  console.error('Error configuring Google OAuth Strategy:', err.message);
}

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const User = (await import('../models/users.js')).default;
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;