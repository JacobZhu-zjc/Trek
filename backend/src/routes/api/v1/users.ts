import express, {NextFunction, Request, Response} from "express";

const router = express.Router();

/* NOTE: these endpoints are all /api/v1/ */

/* GET a user. */
router.get('/:username', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get publicly available information about a user');
});

/* GET a user's profile picture. */
router.get('/:username/picture', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get the profile picture of the given username.');
});

/* GET the authenticated user. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get profile information about the currently authenticated user');
});

/* TODO: discuss if based off username or authentication */
/* GET authenticated user settings. */
router.get('/settings', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get the profile picture of the given username.');
});

/* POST (create) a new user. */
router.post('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('Create a new user');
});

/* TODO: discuss if based off username or authentication */
/* PUT (update) a user's settings. */
router.put('/:username/settings', function(req: Request, res: Response, next: NextFunction) {
  res.send('Update a user\'s settings.');
});

/* TODO: discuss if based off username or authentication */
/* PUT (edit) a user's profile information. */
router.put('/:username', function(req: Request, res: Response, next: NextFunction) {
  res.send('Edit user profile information');
});

/* TODO: discuss if based off username or authentication */
/* DELETE a user. */
router.delete('/:username', function(req: Request, res: Response, next: NextFunction) {
  res.send('Update the settings of a user with specified username.');
});

export default router;
