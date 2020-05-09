import ButtonLoadMoreComponent from "../components/button-load-more/button-load-more.js";
import NoTasksComponent from "../components/task/no-tasks.js";
import SortComponent from "../components/sort/sort.js";
import TasksComponent from "../components/task/tasks.js";
import TaskController from "./task.js";
import {getSortedTasks} from "../helpers/utils.js";
import {render, remove} from "../helpers/render.js";
import flatpickr from "flatpickr";

import "flatpickr/dist/flatpickr.min.css";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._tasks = [];
    this._showedTaskControllers = [];
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._buttonLoadMoreComponent = new ButtonLoadMoreComponent();

    this._onButtonLoadMoreClick = this._onButtonLoadMoreClick.bind(this);
    this._onDataChange = this._onDataChange.bind(this);
    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._onViewChange = this._onViewChange.bind(this);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
    this._flatpickr = flatpickr(`.calendar`, {});
  }

  render(tasks) {
    this._tasks = tasks;
    this._taskListElement = this._tasksComponent.getElement();

    const container = this._container.getElement();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const newTasks = this._renderTasksOnBoard(this._tasks.slice(0, this._showingTasksCount));

    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    this._renderButtonLoadMore(tasks);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderTasksOnBoard(tasks) {
    return tasks.map((task) => {
      const taskController = new TaskController(this._taskListElement, this._onDataChange, this._onViewChange);

      taskController.render(task);

      return taskController;
    });
  }

  _onButtonLoadMoreClick() {
    this._prevTasksCount = this._showingTasksCount;
    this._showingTasksCount += SHOWING_TASKS_COUNT_BY_BUTTON;

    const newTasks = this._renderTasksOnBoard(this._showingTasks.slice(this._prevTasksCount, this._showingTasksCount));

    this._showedTaskControllers = this._showedTaskControllers.concat(newTasks);

    if (this._showingTasksCount >= this._tasks.length) {
      remove(this._buttonLoadMoreComponent);
    }
  }

  _renderButtonLoadMore(showingTasks) {
    this._showingTasks = showingTasks;

    if (this._buttonLoadMoreComponent) {
      remove(this._buttonLoadMoreComponent);
    }

    render(this._container.getElement(), this._buttonLoadMoreComponent);

    this._buttonLoadMoreComponent.setClickHandler(this._onButtonLoadMoreClick);
  }

  _onDataChange(taskController, oldData, newData) {
    const index = this._tasks.findIndex((item) => item === oldData);

    if (index === -1) {
      return;
    }

    this._tasks = [].concat(this._tasks.slice(0, index), newData, this._tasks.slice(index + 1));

    taskController.render(this._tasks[index]);
  }

  _onViewChange() {
    this._showedTaskControllers.forEach((it) => it.setDefaultView());
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._showingTasks = [];

    const sortedTasks = getSortedTasks(this._tasks, sortType);

    this._taskListElement.innerHTML = ``;

    const flatpickers = document.querySelectorAll(`.flatpickr-calendar`);
    flatpickers.forEach((flatpicker) => flatpicker.remove());

    this._showedTaskControllers = this._renderTasksOnBoard(sortedTasks.slice(0, this._showingTasksCount));
    this._renderButtonLoadMore(sortedTasks);
  }
}
