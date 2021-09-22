/**
 *
 *
 * @export
 * @class Task
 */
export class Task {
  /**
   *
   *
   * @private
   * @type {string}
   * @memberof Task
   */
  private _id!: string;

  /**
   *
   *
   * @type {string}
   * @memberof Task
   */
  name!: string;

  /**
   *
   *
   * @type {string}
   * @memberof Task
   */
  userId!: string;

  /**
   *
   *
   * @type {Date}
   * @memberof Task
   */
  expectedfinishAt!: Date;

  /**
   *
   *
   * @type {Date}
   * @memberof Task
   */
  finishAt!: Date;
}
