import TaskComponent from "../components/task/task.js";
import TaskEditComponent from "../components/task/task-edit.js";
import ButtonLoadMoreComponent from "../components/button-load-more/button-load-more.js";
import NoTasksComponent from "../components/task/no-tasks.js";
import SortComponent from "../components/sort/sort.js";
import TasksComponent from "../components/task/tasks.js";

import {Keycode} from "../helpers/constants.js";
import {getSortedTasks} from "../helpers/utils.js";
import {render, replace, remove} from "../helpers/render.js";

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

  render(taskListElement, taskComponent);
};

const renderTasksOnBoard = (tasksArray, tasksStartCount, tasksEndCount, tasksBoard) => {
  tasksArray.slice(tasksStartCount, tasksEndCount)
      .forEach((task) => {
        renderTask(tasksBoard, task);
      });
};

export default class BoardController {
  constructor(container) {
    this._container = container;
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new ButtonLoadMoreComponent();
  }

  renderButtonLoadMore(tasks, showingTasksCount, taskListElement) {
    if (this._loadMoreButtonComponent) {
      remove(this._loadMoreButtonComponent);
    }

    render(this._container.getElement(), this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() =>{
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      renderTasksOnBoard(tasks, prevTasksCount, showingTasksCount, taskListElement);

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  render(tasks) {
    const container = this._container.getElement();
    const isAllTasksArchived = tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();

    let showingTasksCount = SHOWING_TASKS_COUNT_ON_START;

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, sortType);
      taskListElement.innerHTML = ``;

      renderTasksOnBoard(sortedTasks, 0, showingTasksCount, taskListElement);
      this.renderButtonLoadMore(sortedTasks, showingTasksCount, taskListElement);
    });

    renderTasksOnBoard(tasks, 0, showingTasksCount, taskListElement);
    this.renderButtonLoadMore(tasks, showingTasksCount, taskListElement);
  }
}
