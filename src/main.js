import {createFiltersTemplate} from "./components/filters-template.js";
import {createMenuTemplate} from "./components/menu-template.js";
import {createSortTemplate} from "./components/sort-template.js";
import {createTaskEditTemplate} from "./components/task-edit-template.js";
import {createTaskTemplate} from "./components/task-template.js";
import {renderBoardContainer} from "./components/board.js";
import {renderButtonLoadMore} from "./components/button-load-more.js";
import {generateFilter} from "./components/filter.js";
import {generateTasks} from "./components/task.js";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const tasks = generateTasks(TASK_COUNT);

const renderComponent = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const mainElement = document.querySelector(`.main`);
const menuElement = mainElement.querySelector(`.main__control`);

renderComponent(menuElement, createMenuTemplate(), `beforeend`);

const filters = generateFilter();

renderComponent(mainElement, createFiltersTemplate(filters), `beforeend`);

renderComponent(mainElement, renderBoardContainer(), `beforeend`);

const board = mainElement.querySelector(`.board`);

renderComponent(board, createSortTemplate(), `afterbegin`);

const boardTasks = board.querySelector(`.board__tasks`);

renderComponent(boardTasks, createTaskEditTemplate(tasks[0]), `beforeend`);

let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

tasks.slice(1, showingTasksCount)
  .forEach((task) => renderComponent(boardTasks, createTaskTemplate(task), `beforeend`));

renderComponent(board, renderButtonLoadMore(), `beforeend`);

const loadMoreButton = board.querySelector(`.load-more`);

loadMoreButton.addEventListener(`click`, () => {
  const prevTasksCount = showingTasksCount;
  showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

  tasks.slice(prevTasksCount, showingTasksCount)
    .forEach((task) => renderComponent(boardTasks, createTaskTemplate(task), `beforeend`));

  if (showingTasksCount >= tasks.length) {
    loadMoreButton.remove();
  }
});
