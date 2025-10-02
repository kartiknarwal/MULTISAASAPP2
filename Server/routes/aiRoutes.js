import express from 'express';
import { auth } from '../middlewares/auth.js';
import {
  generateArticle,
  generateBlogTitle,
  generateImage,
  removeImageBackground,
  removeImageObject,
  resumeReview
} from '../controllers/aiController.js';
import { upload } from '../configs/multer.js';

const aiRouter = express.Router();

// Text generation routes
aiRouter.post('/generate-article', auth, generateArticle);
aiRouter.post('/generate-blog-title', auth, generateBlogTitle);

// Image generation routes
aiRouter.post('/generate-image', auth, generateImage);

// Image editing routes
aiRouter.post('/remove-image-background', auth, removeImageBackground);
aiRouter.post('/remove-image-object', auth, upload.single('document'), removeImageObject);

// Resume analysis
aiRouter.post('/resume-review', auth, upload.single('resume'), resumeReview);

export default aiRouter;
