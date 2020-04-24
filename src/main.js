import BoardComponent from "./components/board/board.js";
import ButtonLoadMoreComponent from "./components/button-load-more/button-load-more.js";
import FilterComponent from "./components/filter/filter.js";
import NoTasksComponent from "./components/task/no-tasks.js";
import SiteMenuComponent from "./components/menu/site-menu.js";
import SortComponent from "./components/sort/sort.js";
import TaskEditComponent from "./components/task/task-edit.js";
import TaskComponent from "./components/task/task.js";
import TasksComponent from "./components/task/tasks.js";
import {generateFilter} from "./components/filter/generate-filters.js";
import {generateTasks} from "./components/task/generate-task.js";
import {render, RenderPosition, replace, remove} from "./helpers/render.js";
import {Keycode} from "./helpers/constants.js";

const TASK_COUNT = 22;
const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

const renderTask = (taskListElement, task) => {
  const replaceTaskToEdit = () => {
    replace(taskEditComponent, taskComponent);
  };

  const replaceEditToTask = () => {
    replace(taskComponent, taskEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === Keycode.ESCAPE) {
      replaceEditToTask();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  const taskComponent = new TaskComponent(task);
  const taskEditComponent = new TaskEditComponent(task);

  taskComponent.setEditButtonClickHandler(() => {
    replaceTaskToEdit();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  taskEditComponent.setSubmitHandler((evt) => {
    evt.preventDefault();
    replaceEditToTask();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(taskListElement, taskComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (boardComponent, tasks) => {
  const isAllTasksArchived = tasks.every((task) => task.isArchive);

  if (isAllTasksArchived) {
    render(boardComponent.getElement(), new NoTasksComponent(), RenderPosition.BEFOREEND);
    return;
  }

  render(boardComponent.getElement(), new SortComponent(), RenderPosition.BEFOREEND);
  render(boardComponent.getElement(), new TasksComponent(), RenderPosition.BEFOREEND);

  const taskListElement = boardComponent.getElement().querySelector(`.board__tasks`);

  let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
  tasks.slice(0, showingTasksCount)
    .forEach((task) => {
      renderTask(taskListElement, task);
    });

  const loadMoreButtonComponent = new ButtonLoadMoreComponent();
  render(boardComponent.getElement(), loadMoreButtonComponent, RenderPosition.BEFOREEND);

  loadMoreButtonComponent.setClickHandler(() => {
    const prevTasksCount = showingTasksCount;
    showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

    tasks.slice(prevTasksCount, showingTasksCount)
      .forEach((task) => renderTask(taskListElement, task));

    if (showingTasksCount >= tasks.length) {
      remove(loadMoreButtonComponent);
    }
  });
};

const siteMainElement = document.querySelector(`.main`);
const siteHeaderElement = siteMainElement.querySelector(`.main__control`);

const tasks = generateTasks(TASK_COUNT);
const filters = generateFilter();

render(siteHeaderElement, new SiteMenuComponent(), RenderPosition.BEFOREEND);
render(siteMainElement, new FilterComponent(filters), RenderPosition.BEFOREEND);

const boardComponent = new BoardComponent();
render(siteMainElement, boardComponent, RenderPosition.BEFOREEND);
renderBoard(boardComponent, tasks);
