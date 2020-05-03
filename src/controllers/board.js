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
    this._noTasksComponent = new NoTasksComponent();
    this._sortComponent = new SortComponent();
    this._tasksComponent = new TasksComponent();
    this._loadMoreButtonComponent = new ButtonLoadMoreComponent();
  }

  renderTasksOnBoard(tasks, tasksStartCount, tasksEndCount, tasksBoard) {
    tasks.slice(tasksStartCount, tasksEndCount)
        .forEach((task) => {
          renderTask(tasksBoard, task);
        });
  }

  renderButtonLoadMore(tasks, showingTasksCount, taskListElement) {
    if (this._loadMoreButtonComponent) {
      remove(this._loadMoreButtonComponent);
    }

    render(this._container.getElement(), this._loadMoreButtonComponent);

    this._loadMoreButtonComponent.setClickHandler(() =>{
      const prevTasksCount = showingTasksCount;
      showingTasksCount = showingTasksCount + SHOWING_TASKS_COUNT_BY_BUTTON;

      this.renderTasksOnBoard(tasks, prevTasksCount, showingTasksCount, taskListElement);

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

    this.renderTasksOnBoard(tasks, 0, showingTasksCount, taskListElement);
    this.renderButtonLoadMore(tasks, showingTasksCount, taskListElement);

    this._sortComponent.setSortTypeChangeHandler((sortType) => {
      showingTasksCount = SHOWING_TASKS_COUNT_BY_BUTTON;

      const sortedTasks = getSortedTasks(tasks, sortType);
      taskListElement.innerHTML = ``;

      this.renderTasksOnBoard(sortedTasks, 0, showingTasksCount, taskListElement);
      this.renderButtonLoadMore(sortedTasks, showingTasksCount, taskListElement);
    });
  }
}
