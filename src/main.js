import BoardComponent from "./components/board/board.js";
import BoardController from "./controllers/board.js";
import FilterComponent from "./components/filter/filter.js";
import SiteMenuComponent from "./components/menu/site-menu.js";
import {generateFilter} from "./components/filter/generate-filters.js";
import {generateTasks} from "./components/task/generate-task.js";
import {render, RenderPosition} from "./helpers/render.js";

const TASK_COUNT = 22;

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilter();

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
const boardController = new BoardController(boardComponent);

render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
boardController.render(tasks);
