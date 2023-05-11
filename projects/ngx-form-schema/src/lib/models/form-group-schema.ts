import { AbstractControl, AbstractControlOptions, FormGroup, ValidatorFn } from '@angular/forms';
import { FormControlSchema } from './form-control-schema';
import { FormSchemaElement, GroupSchemaControls } from '../types';
import { forEachControl } from '../helpers/forEachControl';

/**
 * Estende la classe FormGroup di Angular con la possibilità di impostare i ruoli dell'utente
 * per tutti i campi all'interno del gruppo.
 */
export class FormGroupSchema<
  UserRole extends string = string,
  TControls extends Record<string, FormSchemaElement<any, UserRole>> = any,
  > extends FormGroup<TControls> {
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
  constructor(schema: GroupSchemaControls<UserRole, TControls>, validatorOrOpts?: ValidatorFn | AbstractControlOptions & { userRoles?: UserRole[] } | ValidatorFn[]) {
    const { fields, key } = schema;
    // Se "fields" è un array, lo converto in un oggetto con chiavi e valori.
    // In caso contrario, lascio "fields" così com'è.
    const controls: TControls = Array.isArray(fields) ?
      fields.reduce((acc, curr) => {
        acc[curr.key] = curr;
        return acc;
      }, {} as { [key: string]: FormControlSchema<UserRole> | FormGroupSchema<UserRole, TControls> }) :
      fields;

    super(controls, validatorOrOpts);

    this.key = key;

    if (typeof validatorOrOpts === "object" && !Array.isArray(validatorOrOpts) && validatorOrOpts.userRoles) {
      this.setUserRoles(validatorOrOpts.userRoles);
    }
  }

  public override get<P extends FormGroupSchema<UserRole, TControls> | FormControlSchema<UserRole>>(path: any): P { return super.get(path) as P; }

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

  public override addControl<K extends string>(name: K, control: TControls[K], options?: {
    emitEvent?: boolean;
  }): void {
    if (control instanceof FormControlSchema || control instanceof FormGroupSchema) {
      control.setUserRoles(this._userRoles);
    }

    super.addControl(name, control, options);
  }

  public override setControl<K extends string & keyof TControls>(name: K, control: TControls[K], options?: {
    emitEvent?: boolean;
  }): void {
    if (super.controls[name] instanceof FormControlSchema || super.controls[name] instanceof FormGroupSchema) {
      // update value and validity by schema
      this._userRoles.length > 0 && (super.controls[name] as FormControlSchema).setUserRoles(this._userRoles);
      (super.controls[name] as FormControlSchema).checkConditionsAndUpdateState();
    }

    super.setControl(name, control, options);
  }

  /**
   * Verifica le condizioni e aggiorna lo stato dello schema
   * @param dataSrc
   */
  public checkConditionsAndUpdateState(dataSrc?: Record<string, any>): void {
    Object.values(this.controls).forEach(control => {
      if (control instanceof FormControlSchema || control instanceof FormGroupSchema) {
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
      if (control instanceof FormControlSchema || control instanceof FormGroupSchema) {
        control.setUserRoles(this._userRoles);
      }
    });
  }
}
