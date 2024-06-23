import express, {NextFunction, Request, Response} from "express";

const router = express.Router();

/* NOTE: these endpoints are all /api/v1/

/* GET list of trips. */
router.get('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get all the trips associated with the authenticated user');
});

/* GET list of trips associated with a particular user. */
router.get('/:username', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get all the trips associated with a particular username. If auth token provided, more trips will be displayed (depending on privacy).');
});

/* GET a particular trip given UUID if authorized. */
router.get('/:uuid', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get detailed trip information for the trip given UUID if user is authorized');
});

/* GET a particular trip's map information given UUID if authorized. */
router.get('/:uuid/map', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get a trip\'s map information given UUID if authorized');
});

/* GET a particular trip's timeline given UUID if authorized. */
router.get('/:uuid/timeline', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get the timeline information for a given trip.');
});

/* GET a particular trip's picture given UUID if authorized. */
router.get('/:uuid/picture', function(req: Request, res: Response, next: NextFunction) {
  res.send('Get a trip\'s picture given UUID if authorized');
});

/* POST (create) a new trip under authenticated user. */
router.post('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('Create a new trip under the authenticated users ownership ');
});

/* PUT (update) a trip's information given uuid and if authorized. */
router.put('/', function(req: Request, res: Response, next: NextFunction) {
  res.send('Create a new trip under the authenticated users ownership ');
});

/* PUT (update) a trip's map information given uuid and if authorized. */
router.put('/:uuid/map', function(req: Request, res: Response, next: NextFunction) {
  res.send('Update a trip\'s map information');
});

/* PUT (update) a trip's timeline given uuid and if authorized. */
router.put('/:uuid/timeline', function(req: Request, res: Response, next: NextFunction) {
  res.send("Update a trip's timeline under the authenticated user's ownership");
});

/* DELETE a trip's information given uuid and if authorized. */
router.put('/:uuid/map', function(req: Request, res: Response, next: NextFunction) {
  res.send('Delete a trip\'s information');
});

export default router;
