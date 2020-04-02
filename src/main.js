import {createMenuTemplate} from "./components/menu-template.js";
import {createFiltersTemplate} from "./components/filters-template.js";
import {renderBoardContainer} from "./components/board.js";
import {createSortTemplate} from "./components/sort-template.js";
import {createTaskEditTemplate} from "./components/task-edit-template.js";
import {renderTaskTemplate} from "./components/task-template.js";
import {renderButtonLoadMore} from "./components/button-load-more.js";

const TASKS_AMOUNT = 3;

const renderComponent = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const renderTasks = (container, template, place) => {
  for (let i = 0; i < TASKS_AMOUNT; i++) {
    renderComponent(container, template, place);
  }
};

const mainElement = document.querySelector(`.main`);
const menuElement = mainElement.querySelector(`.main__control`);

renderComponent(menuElement, createMenuTemplate(), `beforeend`);
renderComponent(mainElement, createFiltersTemplate(), `beforeend`);

renderComponent(mainElement, renderBoardContainer(), `beforeend`);

const board = mainElement.querySelector(`.board`);

renderComponent(board, createSortTemplate(), `afterbegin`);

const boardTasks = board.querySelector(`.board__tasks`);

renderComponent(boardTasks, createTaskEditTemplate(), `beforeend`);
renderTasks(boardTasks, renderTaskTemplate(), `beforeend`);

renderComponent(board, renderButtonLoadMore(), `beforeend`);
