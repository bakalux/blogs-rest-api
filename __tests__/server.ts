import { app, PORT } from '../src/app';

export const server = app.listen(PORT, () => {
    console.log('server is listening on port ' + PORT);
});
