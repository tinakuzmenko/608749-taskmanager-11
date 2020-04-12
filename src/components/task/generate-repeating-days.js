const DefaultRepeatingDays = {
  "mo": false,
  "tu": false,
  "we": false,
  "th": false,
  "fr": false,
  "sa": false,
  "su": false,
};

const generateRepeatingDays = () => {
  const dayKeys = Object.keys(DefaultRepeatingDays);
  const repeatingDay = dayKeys.map((day) => ({[day]: Math.random() > 0.5}));
  return Object.assign({}, ...repeatingDay);
};

export {generateRepeatingDays, DefaultRepeatingDays};
