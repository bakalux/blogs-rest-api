import express from 'express';
import cors from 'cors';

const PORT = process.env.PORT || 3005;

export const app = express();

app.use(express.json());
app.use(cors());

export const server = app.listen(() => {
	console.log('server is listenning on port' + PORT);
})
