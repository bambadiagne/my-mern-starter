import { connect } from 'mongoose';

export class MongooseService {
  private count = 0;
  private readonly db_string = process.env.DB_CONNEXION_STRING;

  public lancerConnexion(): void {
    console.log('MongoDB connection with retry');
    connect(this.db_string)
      .then(() => {
        console.log('MongoDB is connected');
      })
      .catch((err) => {
        console.log({
          message: 'MongoDB connection unsuccessful, retry after 5 seconds. ',
          retry: ++this.count,
          err
        });
        setTimeout(this.lancerConnexion, 5000);
      });
  }
}
