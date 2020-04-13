import {FILTER_NAMES} from '../../helpers/constants.js';

const generateFilter = () => {
  return FILTER_NAMES.map((filterName) => {
    return {
      title: filterName,
      count: Math.floor(Math.random() * 10),
    };
  });
};

export {generateFilter};
