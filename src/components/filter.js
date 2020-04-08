const filterNames = [`all`, `overdue`, `today`, `favorites`, `repeating`, `archive`];

const generateFilter = () => {
  return filterNames.map((it) => {
    return {
      title: it,
      count: Math.floor(Math.random() * 10),
    };
  });
};

export {generateFilter};
