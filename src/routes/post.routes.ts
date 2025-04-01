import express from 'express';
import {
  createPost,
  getFeedPosts,
  likePost,
  commentOnPost,
} from '../controllers/post.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = express.Router();

router.post('/', authenticate, createPost);
router.get('/feed', authenticate, getFeedPosts);
router.put('/like/:id', authenticate, likePost);
router.post('/comment/:id', authenticate, commentOnPost);

export default router;
