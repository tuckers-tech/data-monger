class DriverController {
  constructor(sqlite, driverConstructor) {
    this.db = new sqlite.Database(driverConstructor);
  }

  /**
   *
   * @param {Query} query - Query to find Resource
   */
  findOne(targetCollection, query) {
    return new Promise((resolve, reject) => {
      let queryData = this._convertQueryToSQL(query);

      let execQuery = `SELECT * FROM ${targetCollection} WHERE ${queryData.queryString} LIMIT 1`;

      this.db.get(execQuery, queryData.queryMap, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(rows);
      });
    });
  }

  /**
   *
   * @param {Query} query - Query to find Resource
   */
  find(targetCollection, query) {
    return new Promise((resolve, reject) => {
      let queryData = this._convertQueryToSQL(query);

      let execQuery = `SELECT * FROM ${targetCollection} WHERE ${queryData.queryString}`;

      this.db.all(execQuery, queryData.queryMap, (err, rows) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        resolve(rows);
      });
    });
  }

  /**
   *
   * @param {Resource} resource - Resource to create or update in DB
   */
  setOne(resource) {}

  /**
   *
   * @param {Resource[]} resource - Array of resources to create or update in DB
   */
  set(resource) {}

  /**
   *
   * @param {*} query Query to convert to SQL
   */
  _convertQueryToSQL(query) {
    let queryString = '';
    let queryMap = {};

    let keyCount = 0;

    for (const [key, value] of Object.entries(query)) {
      if (keyCount > 0) {
        queryString += ' AND ';
      }

      queryString += `${key} = $${key}`;

      queryMap[`$${key}`] = value;

      keyCount++;
    }

    return { queryString, queryMap };
  }
}

module.exports = DriverController;