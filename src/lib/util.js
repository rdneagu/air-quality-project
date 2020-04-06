import _ from 'lodash';

export default {
  findDefault: (items) => {
    let defaultItem;
    _.forEach(items, (item, key) => {
      defaultItem = defaultItem || key;
      if (item.default) defaultItem = key;
    });
    return defaultItem;
  },
};
