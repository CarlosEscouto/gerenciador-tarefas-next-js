export type TaskRequest = {
  /**
   *
   *
   * @type {string}
   * @memberof TaskRequest
   */
  _id?: string;

  /**
   *
   *
   * @type {string}
   * @memberof TaskRequest
   */
  name: string;

  /**
   *
   *
   * @type {string}
   * @memberof TaskRequest
   */
  userId: string;

  /**
   *
   *
   * @type {Date}
   * @memberof TaskRequest
   */
  expectedfinishAt: Date;

  /**
   *
   *
   * @type {Date}
   * @memberof TaskRequest
   */
  finishAt: Date;
};
