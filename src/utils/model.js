/**
 *  Usage：
 *  export const Book = (json) => {
 *    return model(json)
 *      .string(['author', 'bookName', 'bookPrice', 'channelName', 'coverImg', 'isbn', 'lastModifiedDate', 'location', 'publish', 'typeCode', 'typeName'])
 *      .number(['adviserId', 'bookId', 'bookAdviserId', 'bookQrCount', 'bookStatus', 'browseCounts', 'channelId', 'income', 'messageCount'])
 *      .boolean(['isFundSupport', 'isMainEditor', 'relationQrcode'])
 *      .array(['typeCodeNames'])
 *      .toImmutable();
 *  };
 *
 */

class Model {
  constructor(data = {}) {
    this._data = data;
  }

  // 通用定义参数，内部使用，不推荐外部使用
  default(type, args = [], defaultValue = "") {
    [].concat(args).forEach((key) => {
      // check value type
      if (!TYPE_SCHEMA[type].is(this._data[key])) {
        this._data[key] = defaultValue;
      }
    });

    return this;
  }

  // 添加model参数规则
  model(args = [], _model) {
    if (!_model) {
      console.error("a model is expected as the 2nd param");
      return this;
    }

    [].concat(args).forEach((key) => {
      const value = this._data[key];
      this._data[key] = _model(value);
    });

    return this;
  }

  /**
   * 定义数据整合方法，用作数据整合
   * @param formatter: 数据的具体处理方法，函数返回的结果会通过Object.assign覆盖原始json
   * @return {Model}
   */
  compose(formatter) {
    if (typeof formatter === "function") {
      Object.assign(this._data, formatter(this._data));
    }

    return this;
  }

  // 转换为immutable对象
  toImmutable() {
    return JSON.parse(JSON.stringify(this._data));
  }

  // 转换为JSON对象
  toJSON() {
    return this._data;
  }
}

// 数据类型定义
const TYPE_SCHEMA = {
  string: {
    is: (str) => typeof str === "string",
    defaultValue: ""
  },
  number: {
    is: (num) => typeof num === "number" && !Number.isNaN(num),
    defaultValue: 0
  },
  array: {
    is: (arr) => Array.isArray(arr),
    defaultValue: []
  },
  object: {
    is: (obj) => obj && typeof obj === "object",
    defaultValue: {}
  },
  boolean: {
    is: (bool) => typeof bool === "boolean",
    defaultValue: false
  }
};

// 添加不同数据类型参数的定义方法
for (let type in TYPE_SCHEMA) {
  const schema = TYPE_SCHEMA[type];
  Model.prototype[type] = function (args = [], defaultValue = schema.defaultValue) {
    return this.default(type, args, defaultValue);
  };
}

export default function model(...args) {
  return new Model(...args);
}

/**
 * 生成列表model
 * @param itemModel: recordList中的item对应的model
 * @return {*}
 */
export const PageBean = (itemModel) => (json) =>
  model(json)
    .number(["numPerPage", "currentPage", "totalCount"])
    .array("recordList")
    .compose((_json) => ({
      recordList: _json.recordList.map(itemModel)
    }))
    .toImmutable();

/**
 * ArrMap model
 * @param itemModel: arr中的item对应的model
 */
export const ListModel = (itemModel) => (arr) => arr.map(itemModel);
