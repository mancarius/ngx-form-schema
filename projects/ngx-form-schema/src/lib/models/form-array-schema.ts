import { AbstractControl, AbstractControlOptions, FormArray, ValidatorFn } from '@angular/forms';
import { FormControlSchema } from './form-control-schema';
import { ArraySchemaControls, FormSchemaElement } from '../types';
import { forEachControl } from '../helpers/forEachControl';
import { FormGroupSchema } from './form-group-schema';


export class FormArraySchema<
  UserRole extends string = string,
  TControl extends FormSchemaElement<any, UserRole> = any,
  > extends FormArray<TControl> {
  public key: string | number | undefined = undefined;

  private _userRoles: UserRole[] = [];

  /**
   * Costruttore della classe.
   *
   * @param template Oggetto o array di oggetti "FormControlSchema" o "FormGroupSchema"
   * che rappresentano i campi all'interno del gruppo.
   *
   * @param validatorOrOpts Opzioni di validazione per il gruppo.
   */
  constructor(schema: ArraySchemaControls<UserRole, TControl[]>, validatorOrOpts?: ValidatorFn | AbstractControlOptions & { userRoles?: UserRole[] } | ValidatorFn[]) {
    const { fields, key } = schema;
    // Se "fields" è un array, lo converto in un oggetto con chiavi e valori.
    // In caso contrario, lascio "fields" così com'è.
    const controls: TControl[] = fields;

    super(controls, validatorOrOpts);

    this.key = key;

    if (typeof validatorOrOpts === "object" && !Array.isArray(validatorOrOpts) && validatorOrOpts.userRoles) {
      this.setUserRoles(validatorOrOpts.userRoles);
    }
  }

  public override get<P extends FormArraySchema<UserRole, TControl> | FormControlSchema<UserRole>>(path: any): P { return super.get(path) as P; }

  /**
   * Imposta i ruoli dell'utente per tutti i campi all'interno del gruppo.
   *
   * @param roles Array contenente i ruoli dell'utente.
   */
  public setUserRoles(roles: UserRole[]) {
    this._userRoles = [...roles];
    // Aggiorno i ruoli di ogni controllo all'interno di questo gruppo.
    this._updateChildrenUserRoles();
  }

  public override insert(index: number, control: TControl, options?: {
    emitEvent?: boolean;
  }): void {
    if (control instanceof FormControlSchema || control instanceof FormArraySchema || control instanceof FormGroupSchema) {
      control.setUserRoles(this._userRoles);
    }

    super.insert(index, control, options);
  }

  public override push(control: TControl, options?: {
    emitEvent?: boolean;
  }): void {
    if (control instanceof FormControlSchema || control instanceof FormArraySchema || control instanceof FormGroupSchema) {
      control.setUserRoles(this._userRoles);
    }

    super.push(control, options);
  }

  public override setControl(index: number, control: TControl, options?: {
    emitEvent?: boolean;
  }): void {
    if (super.controls[index] instanceof FormControlSchema || super.controls[index] instanceof FormGroupSchema || super.controls[index] instanceof FormArraySchema) {
      // update value and validity by schema
      this._userRoles.length > 0 && (super.controls[index] as FormControlSchema).setUserRoles(this._userRoles);
      (super.controls[index] as FormControlSchema).checkConditionsAndUpdateState();
    }

    super.setControl(index, control, options);
  }

  /**
   * Verifica le condizioni e aggiorna lo stato dello schema
   * @param dataSrc
   */
  public checkConditionsAndUpdateState(dataSrc?: Record<string, any>): void {
    Object.values(this.controls).forEach(control => {
      if (control instanceof FormControlSchema || control instanceof FormArraySchema || control instanceof FormGroupSchema) {
        control.checkConditionsAndUpdateState(dataSrc);
      }
    })
  }

  /**
   * Aggiorna i ruoli dell'utente per tutti i campi all'interno del gruppo.
   */
  private _updateChildrenUserRoles() {
    // Per ogni controllo all'interno di questo gruppo, aggiorno i ruoli.
    forEachControl(this.controls, (control: AbstractControl) => {
      if (control instanceof FormControlSchema || control instanceof FormGroupSchema || control instanceof FormArraySchema) {
        control.setUserRoles(this._userRoles);
      }
    });
  }


}
