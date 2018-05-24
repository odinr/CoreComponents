import express from "express";
import morgan from "morgan";
import chalk from "chalk";
import figures from "figures";

export function server({sources, env,port}){
    const app = express();
    port = port||8080;
    app.use(morgan(env || 'dev'));
    sources.map(src => app.use(express.static(src)));
    app.listen(port, () => console.log(chalk.green(figures.tick),'DevServer started on ',chalk.blue(`http://localhost:${port}`)));
    return app;
}
export default server;