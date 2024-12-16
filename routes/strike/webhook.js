const router = express.Router();

router.post("/", (req, res) => {
  res.send("Hello World");
});

const blackBoxRouter = router;

export default blackBoxRouter;
