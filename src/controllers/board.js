import ButtonLoadMoreComponent from "../components/button-load-more/button-load-more.js";
import NoTasksComponent from "../components/task/no-tasks.js";
import SortComponent from "../components/sort/sort.js";
import TasksComponent from "../components/task/tasks.js";
import TaskController from "./task.js";
import {getSortedTasks} from "../helpers/utils.js";
import {render, remove} from "../helpers/render.js";

const SHOWING_TASKS_COUNT_ON_START = 8;
const SHOWING_TASKS_COUNT_BY_BUTTON = 8;

export default class BoardController {
  constructor(container) {
    this._container = container;

    this._showingTasksCount = SHOWING_TASKS_COUNT_ON_START;
    this._tasks = [];
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new ButtonLoadMoreComponent();

    this._onSortTypeChange = this._onSortTypeChange.bind(this);
    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }

  _renderTasksOnBoard(tasks, tasksStartCount, tasksEndCount, tasksBoard) {
    this._taskController = new TaskController(tasksBoard);

    tasks.slice(tasksStartCount, tasksEndCount)
        .forEach((task) => {
          this._taskController.render(task);
        });
  }

  _renderButtonLoadMore(tasks, showingTasksCount, taskListElement) {
    if (this._loadMoreButtonComponent) {
      remove(this._loadMoreButtonComponent);
    }

    render(this._container.getElement(), this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() =>{
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      this._renderTasksOnBoard(tasks, prevTasksCount, showingTasksCount, taskListElement);

      if (showingTasksCount >= tasks.length) {
        remove(this._loadMoreButtonComponent);
      }
    });
  }

  _onSortTypeChange(sortType) {
    this._showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

    const sortedTasks = getSortedTasks(this._tasks, sortType);
    const taskListElement = this._tasksComponent.getElement();

    taskListElement.innerHTML = ``;

    this._renderTasksOnBoard(sortedTasks, 0, this._showingTasksCount, taskListElement);
    this._renderButtonLoadMore(sortedTasks, this._showingTasksCount, taskListElement);
  }

  render(tasks) {
    this._tasks = tasks;

    const container = this._container.getElement();
    const isAllTasksArchived = this._tasks.every((task) => task.isArchive);

    if (isAllTasksArchived) {
      render(container, this._noTasksComponent);
      return;
    }

    render(container, this._sortComponent);
    render(container, this._tasksComponent);

    const taskListElement = this._tasksComponent.getElement();

    this._renderTasksOnBoard(tasks, 0, this._showingTasksCount, taskListElement);
    this._renderButtonLoadMore(tasks, this._showingTasksCount, taskListElement);

    this._sortComponent.setSortTypeChangeHandler(this._onSortTypeChange);
  }
}
