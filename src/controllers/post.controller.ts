import { Response } from 'express';
import Post from '../models/Post';
import { AuthRequest } from '../middlewares/auth.middleware';
import { asyncHandler } from '../utils/asyncHandler';
import cloudinary from '../config/cloudinary';

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    console.log('step 1', req.body);
    const { content, is_private } = req.body;
    console.log('step 2');
    let mediaUrl = '';
    let mediaType = '';

    console.log('step 3');
    if (req.file) {
      console.log('step 4');
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'e-milo/posts',
        resource_type: 'auto',
      });
      console.log('step 5');
      mediaUrl = result.secure_url;
      mediaType = result.resource_type; // "image" or "video"
    }

    console.log('step 6');
    const newPost = new Post({
      userId: req.user._id,
      content,
      mediaUrl,
      mediaType,
      privacy: is_private === 'true' ? 'private' : 'public',
    });

    const savedPost = await newPost.save();
    return res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const getFeedPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find({
      $or: [{ privacy: 'public' }, { userId: req.user._id }],
    })
      .sort({ createdAt: -1 })
      .populate('userId', 'name profilePic')
      .populate('comments.userId', 'name profilePic');

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err });
  }
};

export const likePost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    const userId = req.user._id.toString();
    const liked = post.likes.includes(userId);

    if (liked) {
      await post.updateOne({ $pull: { likes: userId } });
    } else {
      await post.updateOne({ $push: { likes: userId } });
    }

    const updated = await Post.findById(req.params.id);
    res.json(updated);
  }
);

export const commentOnPost = asyncHandler(
  async (req: AuthRequest, res: Response) => {
    const { comment } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    post.comments.push({ userId: req.user._id, comment });
    await post.save();

    res.json(post);
  }
);
