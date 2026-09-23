import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listConversations,
  createConversation,
  getConversation,
  deleteConversation,
  renameConversation,
  sendMessage,
} from "../controllers/chatController.js";

const router = Router();
router.use(requireAuth);

router.get("/conversations", listConversations);
router.post("/conversations", createConversation);
router.get("/conversations/:id", getConversation);
router.patch("/conversations/:id", renameConversation);
router.delete("/conversations/:id", deleteConversation);
router.post("/conversations/:id/messages", sendMessage);

export default router;
