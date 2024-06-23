import express, {NextFunction, Request, Response} from "express";

const router = express.Router();

/* GET some destination stuff. */

router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get information about destination');
});

export default router;
