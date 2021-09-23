import { TaskDTO } from "../dto/TaskDTO";
import { ValidatorRequest } from "../types/ValidatorRequest";

/**
 *
 *
 * @export
 * @class TaskValidator
 */
export class TaskValidator {
  /**
   * Creates an instance of TaskValidator.
   * @param {TaskDTO} task
   * @memberof TaskValidator
   */
  constructor(public task: TaskDTO) {}

  /**
   *
   *
   * @readonly
   * @type {ValidatorRequest}
   * @memberof TaskValidator
   */
  public get validName(): ValidatorRequest {
    if (!this.task.name || this.task.name.length < 3) return {
      error: 1,
      message: 'O nome precisa ter pelo menos 2 caracteres.'
    };

    return { error: 0 };
  }

  /**
   *
   *
   * @readonly
   * @type {ValidatorRequest}
   * @memberof TaskValidator
   */
  public get validExpectedfinishAt(): ValidatorRequest {
    if (!this.task.expectedfinishAt) return {
      error: 1,
      message: 'A data de previsão é obrigatória.'
    };

    if (!new RegExp(/[0-9]{4}-[0-9]{2}-[0-9]{2}\s[0-9]{2}:[0-9]{2}:[0-9]{2}\s-?[0-9]{2}:[0-9]{2}$$/, 'g').test(this.task.expectedfinishAt.toString())) return {
      error: 1,
      message: 'O formato da data de previsão está invalido. ex: 2021-06-10 10:00:00 -03:00.'
    };

    if (new Date(this.task.expectedfinishAt) < new Date()) return {
      error: 1,
      message: 'A data de previsão não pode ser menor que hoje.'
    };

    return { error: 0 };
  }

  /**
   *
   *
   * @readonly
   * @type {ValidatorRequest}
   * @memberof TaskValidator
   */
  public get validUserId(): ValidatorRequest {
    if (!this.task.userId) return {
      error: 1,
      message: 'O usuário é obrigatório.'
    };

    return { error: 0 };
  }
}