import { UserDTO } from "../dto/UserDTO";
import { ValidatorRequest } from "../types/ValidatorRequest";

/**
 *
 *
 * @export
 * @class UserValidator
 */
export class UserValidator {
  /**
   * Creates an instance of UserValidator.
   * @param {UserDTO} user
   * @memberof UserValidator
   */
  constructor(public user: UserDTO) {}

  /**
   *
   *
   * @readonly
   * @type {ValidatorRequest}
   * @memberof UserValidator
   */
  public get validName(): ValidatorRequest {
    if (!this.user.name || this.user.name.length < 4) return {
      error: 1,
      message: 'O Nome tem que ter pelo menos 3 caracteres.'
    };

    if (new RegExp(/[0-9]/).test(this.user.name)) return {
      error: 1,
      message: 'O Nome não pode ter numeros.'
    };

    return { error: 0 };
  }

  /**
   *
   *
   * @readonly
   * @type {ValidatorRequest}
   * @memberof UserValidator
   */
  public get validEmail(): ValidatorRequest {
    if (!this.user.email) return {
      error: 1,
      message: 'O E-mail é obrigatório.'
    };

    if (!new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z]+\.([a-z]+)?$/, 'i').test(this.user.email)) return {
      error: 1,
      message: 'O E-mail é inválido.'
    };

    return { error: 0 };
  }

  /**
   *
   *
   * @readonly
   * @type {ValidatorRequest}
   * @memberof UserValidator
   */
  public get validPassword(): ValidatorRequest {
    if (!this.user.password) return {
      error: 1,
      message: 'O Senha é obrigatória.'
    };

    if (!new RegExp(/^(?=.*[A-Z].*[A-Z])$/, 'g').test(this.user.password)) return {
      error: 1,
      message: 'O E-mail é precisa ter no minimo 2 caracteres maiusculos.'
    };

    if (!new RegExp(/^(?=.*[!@#$&*])$/, 'g').test(this.user.password)) return {
      error: 1,
      message: 'O E-mail é precisa ter no minimo 1 caracter especial.'
    };

    if (!new RegExp(/^(?=.*[0-9].*[0-9])$/, 'g').test(this.user.password)) return {
      error: 1,
      message: 'O E-mail é precisa ter no minimo 2 numeros.'
    };

    if (!new RegExp(/^(?=.*[a-z].*[a-z].*[a-z])$/, 'g').test(this.user.password)) return {
      error: 1,
      message: 'O E-mail é precisa ter no minimo 3 caracteres minusculos.'
    };

    return { error: 0 };
  }
}