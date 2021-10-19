import { TaskStatusEnum } from "./TaskStatusEnum";

export type FiltersAllowed = {
  /**
   *
   *
   * @type {string}
   */
  userId?: string;

  /**
   *
   *
   * @type {string}
   */
  expectedfinishAtStarts?: string;

  /**
   *
   *
   * @type {string}
   */
  expectedfinishAtEnds?: string;

  /**
   *
   *
   * @type {TaskStatusEnum}
   */
  status?: TaskStatusEnum;
};
