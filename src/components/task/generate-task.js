import {COLORS} from "../../helpers/constants.js";
import {DescriptionItems} from '../../mocks/description-items.js';
import {getRandomArrayItem} from '../../helpers/utils.js';
import {getRandomDate} from '../../mocks/get-random-date.js';
import {generateRepeatingDays, DefaultRepeatingDays} from './generate-repeating-days.js';

const generateTask = () => {
  const dueDate = Math.random() > 0.5 ? null : getRandomDate();

  return {
    description: getRandomArrayItem(DescriptionItems),
    dueDate,
    repeatingDays: dueDate ? DefaultRepeatingDays : generateRepeatingDays(),
    color: getRandomArrayItem(COLORS),
    isArchive: Math.random() > 0.5,
    isFavorite: Math.random() > 0.5,
  };
};

const generateTasks = (count) => {
  return new Array(count)
    .fill(``)
    .map(generateTask);
};

export {generateTask, generateTasks};
