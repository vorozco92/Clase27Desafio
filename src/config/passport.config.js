import passport from "passport";
import local from "passport-local";

import Users from "../dao/dbManagers/users.js";
import { createHash, isValidatePassword } from "../utils/utils.js";
import githubService from "passport-github2";
import CONFIG from './config.js'

const LocalStrategy = local.Strategy;
const userService = new Users();

export const initializatedPassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      {
        passReqToCallback: true,
        usernameField: "email",
      },
      async (req, username, password, done) => {
        const { first_name, last_name, email, age } = req.body;

        try {
          let user = await userService.getById({ email: username });
          if (user) {
            console.log("User already exist");
          }

          const userNew = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
          };
          let result = await  userService.create(userNew);
          return done(null, result);
        } catch (error) {
          return done("error en usuario" + error);
        }
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email", session: false }, async(req, email, password, done) => {
        try {
            console.log('req:'+req+'email:'+email+' '+password)
          const user = await userService.getById({email:email});
          if (!user) return done(null, false, { message: "User not found" });
          const validatePassword = isValidatePassword(user, password);
          if (!validatePassword)
            return done(null, false, { message: "incorrect Password" });
          return done(null, user);
        } catch (error) {
           // console.log(error);
          return done(null,error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let user = await userService.getById({_id:id});
    done(null, user);
  });
};

export const initPassportGit = () => {
  passport.serializeUser((user, done) => {
    done(null, user._id);
  });
  passport.deserializeUser(async (id, done) => {
    let user = await githubService.findById(id);
    done(null, user);
  });

  passport.use(
    "github",
    new githubService(
      {
        clientID: CONFIG.CLIENT_ID,
        clientSecret: CONFIG.CLIENT_SECRET,
        callbackURL: CONFIG.CALLBACK_URL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          let user = await  userService.getById({ email: profile._json.email });
          if (!user) {
            let newUser = {
              first_name: profile._json.name,
              last_name: profile._json.name,
              age: 18,
              email: profile._json.email,
              password: "req",
            };
            let result = await  users.create(newUser);
            done(null, result);
          } else {
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );
};
