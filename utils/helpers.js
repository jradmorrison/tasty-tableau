module.exports = {
  format_date: (date) => {
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
  },

  equal: function (value1, value2, options) {
    return value1 == value2 ? true : false;
  },

  getTimeComponent: function (timeTotal, component) {
    const regex = new RegExp(`PT(\\d+)${component}`);
    const match = timeTotal.match(regex);

    return match ? match[1] : '';
  },

  format_instructions: function (instructions) {
    const displayInstructions = instructions
      .replace(/\[|\]/g, '') // Remove square brackets
      .replace(/(\.\s*),/g, '$1'); // Remove commas after a period

    return displayInstructions;
  },
};
