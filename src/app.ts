import express from 'express';
import cors from 'cors';

import testingRouter from './testing/testing-router';
import blogsRouter from './features/blogs/blogs-router';
import postsRouter from './features/posts/posts-router';
import usersRouter from './features/users/users-router';

export const PORT = process.env.PORT || 3006;

export const app = express();

app.use(express.json());
app.use(cors());

app.use('/testing', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)
app.use('/users', usersRouter);
