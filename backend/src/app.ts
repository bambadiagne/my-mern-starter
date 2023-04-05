import bodyParser from 'body-parser';
import express from 'express';
import passport from 'passport';
import { Config } from './common/env.config';
import { UserModel, User } from './models/user.model';
import { IUserLogin, UserLogin } from './models/user-login.model';
import { MongooseService } from './services/mongoose.service';
const BearerStrategy = require('passport-http-bearer').Strategy;

export class App {
  public app: express.Application;

  constructor(controllers: any[]) {
    this.app = express();
    new MongooseService().lancerConnexion();
    this.initializeMiddlewares();
    this.initializeControllers(controllers);
  }

  private initializeMiddlewares() {
    this.app.use(
      (
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
      ): void => {
        if (req.originalUrl === '/webhook') {
          bodyParser.raw({ type: 'application/json' })(req, res, next);
        } else {
          bodyParser.json()(req, res, next);
        }
      }
    );
    this.app.use(function (req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header(
        'Access-Control-Allow-Methods',
        'GET,HEAD,PUT,PATCH,POST,DELETE'
      );
      res.header('Access-Control-Expose-Headers', 'Content-Length');
      res.header(
        'Access-Control-Allow-Headers',
        'Accept, Authorization, Content-Type, X-Requested-With, Range'
      );
      return next();
    });

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    this.app.use(bodyParser.json());
    passport.use(
      new BearerStrategy(function (token: string, done: any) {
        UserLogin.findOne(
          { authenticationToken: token },
          function (err: any, user: IUserLogin) {
            if (err) {
              return done(err);
            }
            if (!user) {
              return done(null, false);
            }
            UserModel.findById(user.userId, function (err: any, user: User) {
              if (err) {
                return done(err);
              }
              if (!user) {
                return done(null, false);
              }

              return done(null, user, { scope: 'all' });
            });
          }
        );
      })
    );
    passport.serializeUser(function (user, done) {
      done(null, user);
    });

    passport.deserializeUser(function (user: User, done) {
      done(null, user);
    });
  }

  private initializeControllers(controllers: any[]) {
    controllers.forEach((controller) => {
      this.app.use('/', controller.router);
    });
  }

  public listen() {
    this.app.listen(process.env.PORT || Config.port, () => {
      console.log(`App listening on the port ${Config.port}`);
    });
  }
}
