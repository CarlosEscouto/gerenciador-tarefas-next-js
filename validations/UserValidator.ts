import { UserRequest } from "../types/UserRequest";
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
   * @param {UserRequest} user
   * @memberof UserValidator
   */
  constructor(private _user: UserRequest) {}

  /**
   *
   *
   * @readonly
   * @type {ValidatorRequest}
   * @memberof UserValidator
   */
  public get validName(): ValidatorRequest {
    if (!this._user.name || this._user.name.length < 4)
      return {
        error: 1,
        message: "O Nome tem que ter pelo menos 3 caracteres.",
      };

    if (new RegExp(/[0-9]/).test(this._user.name))
      return {
        error: 1,
        message: "O Nome não pode ter numeros.",
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
    if (!this._user.email)
      return {
        error: 1,
        message: "O E-mail é obrigatório.",
      };

    if (
      !new RegExp(/^[a-z0-9.]+@[a-z0-9]+\.[a-z.]+(\.[a-z]+)?$/).test(
        this._user.email
      )
    )
      return {
        error: 1,
        message: "O E-mail é inválido.",
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
    if (!this._user.password)
      return {
        error: 1,
        message: "A Senha é obrigatória.",
      };

    // if (!new RegExp(/^(?=.*[A-Z].*[A-Z])$/, "g").test(this._user.password))
    //   return {
    //     error: 1,
    //     message: "A Senha precisa ter no minimo 2 caracteres maiusculos.",
    //   };

    // if (!new RegExp(/^(?=.*[!@#$&*])$/, "g").test(this._user.password))
    //   return {
    //     error: 1,
    //     message: "A Senha precisa ter no minimo 1 caracter especial.",
    //   };

    // if (!new RegExp(/^(?=.*[0-9].*[0-9])$/, "g").test(this._user.password))
    //   return {
    //     error: 1,
    //     message: "A Senha precisa ter no minimo 2 numeros.",
    //   };

    // if (
    //   !new RegExp(/^(?=.*[a-z].*[a-z].*[a-z])$/, "g").test(this._user.password)
    // )
    //   return {
    //     error: 1,
    //     message: "A Senha precisa ter no minimo 3 caracteres minusculos.",
    //   };

    return { error: 0 };
  }
}
