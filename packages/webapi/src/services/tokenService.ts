import BlacklistedToken from '../models/BlacklistedToken';

export const blacklistToken = async (token: string): Promise<void> => {
  const blacklistedToken = new BlacklistedToken({ token });
  await blacklistedToken.save();
};

export const isTokenBlacklisted = async (token: string): Promise<boolean> => {
  const result = await BlacklistedToken.findOne({ token });
  return result !== null;
};

export const removeBlacklistedToken = async (token: string): Promise<void> => {
  await BlacklistedToken.deleteOne({ token });
};
