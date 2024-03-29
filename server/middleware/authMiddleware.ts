import { verifyJwt } from '../auth';
import { db } from '../datastore/datastoreInterface';
import { typeValidation } from '../types';

export const authMiddleware: typeValidation<any, any> = async (req, res, next) => {
  // token in the header is like : 
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.sendStatus(401);
  }

  try {
    const payload = verifyJwt(token);
    const user = await db.getUserById(payload.userId);
    if (!user) {
      throw 'not found';
    }

    res.locals.userId = user.id;

    next();
  } catch {
    return res.status(401).send({ error: 'Bad token' });
  }
};