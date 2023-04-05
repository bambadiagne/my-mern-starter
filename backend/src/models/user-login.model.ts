import { Schema, model } from 'mongoose';

const UserLoginSchema = new Schema(
  {
    authenticationToken: String,
    expires: String,
    refreshToken: String,
    userId: String
  },
  { timestamps: { createdAt: true } }
);

UserLoginSchema.set('toJSON', {
  virtuals: true
});

export const UserLogin = model('UserLogin', UserLoginSchema);

export class IUserLogin {
  authenticationToken: String = '';
  expires: String = '';
  userId: String = '';
  refreshToken = '';
}
