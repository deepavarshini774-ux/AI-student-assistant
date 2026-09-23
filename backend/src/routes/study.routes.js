import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  generateNotes,
  listNotes,
  getNote,
  generateQuiz,
  listQuizzes,
  generateStudyPlan,
  listStudyPlans,
} from "../controllers/studyController.js";

const router = Router();
router.use(requireAuth);

router.post("/notes", generateNotes);
router.get("/notes", listNotes);
router.get("/notes/:id", getNote);

router.post("/quizzes", generateQuiz);
router.get("/quizzes", listQuizzes);

router.post("/study-plans", generateStudyPlan);
router.get("/study-plans", listStudyPlans);

export default router;
