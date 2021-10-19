/**
 *
 *
 * @export
 * @class TaskDTO
 */
export class TaskDTO {
  /**
   *
   *
   * @private
   * @type {string}
   * @memberof TaskDTO
   */
  private id?: string;

  /**
   *
   *
   * @type {string}
   * @memberof TaskDTO
   */
  name!: string;

  /**
   *
   *
   * @type {string}
   * @memberof TaskDTO
   */
  userId!: string;

  /**
   *
   *
   * @type {Date}
   * @memberof TaskDTO
   */
  expectedfinishAt!: Date;

  /**
   *
   *
   * @type {Date}
   * @memberof TaskDTO
   */
  finishAt?: Date;
}
