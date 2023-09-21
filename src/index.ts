import express from 'express';
import cors from 'cors';

import blogsRouter from './features/blogs/blogs-router';
import testingRouter from './testing/testing-router';
import postsRouter from './features/posts/posts-router';

const PORT = process.env.PORT || 3006;

export const app = express();

app.use(express.json());
app.use(cors());

app.use('/testing', testingRouter)
app.use('/blogs', blogsRouter)
app.use('/posts', postsRouter)

export const server = app.listen(PORT,() => {
	console.log('server is listenning on port ' + PORT);
})
