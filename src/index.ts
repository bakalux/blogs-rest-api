import { app, PORT } from './app';
import { runDb } from "./db";

async function startServer() {
    await runDb();
    app.listen(PORT, () => {
        console.log('server is listening on port ' + PORT);
    });
}

startServer();
