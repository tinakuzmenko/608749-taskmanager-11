import AbstractComponent from "../abstract-component.js";

const renderBoardContainer = () => {
  return `<section class="board container"></section>`;
};

export default class Board extends AbstractComponent {
  getTemplate() {
    return renderBoardContainer();
  }
}
