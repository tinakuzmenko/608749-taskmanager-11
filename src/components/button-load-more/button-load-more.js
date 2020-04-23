import AbstractComponent from "../abstract-component.js";

const renderButtonLoadMore = () => {
  return `<button class="load-more" type="button">load more</button>`;
};

export default class LoadMoreButton extends AbstractComponent {
  getTemplate() {
    return renderButtonLoadMore();
  }
}
