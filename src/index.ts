import express from 'express';
import cors from 'cors';

import blogsRouter from './features/blogs/blogs-router';
import testingRouter from './testing/testing-router';

const PORT = process.env.PORT || 3005;

export const app = express();

app.use(express.json());
app.use(cors());

app.use('/testing', testingRouter)
app.use('/blogs', blogsRouter)

export const server = app.listen(() => {
	console.log('server is listenning on port' + PORT);
})
