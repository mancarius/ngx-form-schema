import { FormArray, FormControl } from '@angular/forms';
import { AbstractControl, AbstractControlOptions, FormGroup, ValidatorFn } from '@angular/forms';
import { FormControlSchema } from './form-control-schema';
import { ControlSchemaTemplate, GroupSchemaTemplate } from './types';

/**
 * Estende la classe FormGroup di Angular con la possibilità di impostare i ruoli dell'utente
 * per tutti i campi all'interno del gruppo.
 */
export class FormGroupSchema<T extends string = string> extends FormGroup {
  public key: string | number | undefined = undefined;
  public override controls: {
    [key: string]: FormControlSchema<T> | FormGroupSchema<T>
  } = {};

  private _userRoles: T[] = [];

  /**
   * Costruttore della classe.
   *
   * @param template Oggetto o array di oggetti "FormControlSchema" o "FormGroupSchema"
   * che rappresentano i campi all'interno del gruppo.
   *
   * @param validatorOrOpts Opzioni di validazione per il gruppo.
   */
  constructor(template: GroupSchemaTemplate<T>, validatorOrOpts?: ValidatorFn | AbstractControlOptions & { userRoles?: T[] } | ValidatorFn[]) {
    const { fields, key } = template;
    // Se "fields" è un array, lo converto in un oggetto con chiavi e valori.
    // In caso contrario, lascio "fields" così com'è.
    const controls = Array.isArray(fields) ?
      fields.reduce((acc, curr) => {
        acc[curr.key] = curr;
        return acc;
      }, {} as { [key: string]: FormControlSchema<T> | FormGroupSchema<T> }) :
      fields;

    super(controls, validatorOrOpts);

    this.key = key;

    if (typeof validatorOrOpts === "object" && !Array.isArray(validatorOrOpts) && validatorOrOpts.userRoles) {
      this.setUserRoles(validatorOrOpts.userRoles);
    }
  }

  public override get<P extends FormGroupSchema<T> | FormControlSchema<T>>(path: any): P { return super.get(path) as P; }

  /**
   * Imposta i ruoli dell'utente per tutti i campi all'interno del gruppo.
   *
   * @param roles Array contenente i ruoli dell'utente.
   */
  public setUserRoles(roles: T[]) {
    this._userRoles = [...roles];
    // Aggiorno i ruoli di ogni controllo all'interno di questo gruppo.
    this._updateChildrenUserRoles();
  }

  public override addControl(name: string, control: FormGroupSchema | FormControlSchema, options?: {
    emitEvent?: boolean;
  }): void {
    if (control instanceof FormControlSchema || control instanceof FormGroupSchema) {
      control.setUserRoles(this._userRoles);
    }

    super.addControl(name, control, options);
  }

  public override setControl(name: string, control: AbstractControl<any, any>, options?: {
    emitEvent?: boolean;
  }): void {
    super.setControl(name, control, options);

    if (super.controls[name] instanceof FormControlSchema || super.controls[name] instanceof FormGroupSchema) {
      // update value and validity by schema
      this._userRoles.length > 0 && (super.controls[name] as FormControlSchema).setUserRoles(this._userRoles);
      (super.controls[name] as FormControlSchema).checkConditionsAndUpdateState();
    }
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
    this._forEachControl(this.controls, (control: AbstractControl) => {
      if (control instanceof FormControlSchema || control instanceof FormGroupSchema) {
        control.setUserRoles(this._userRoles);
      }
    });
  }

  /**
   * Esegue una funzione per ogni controllo all'interno del gruppo.
   *
   * @param fn Funzione da eseguire per ogni controllo.
   */
  private _forEachControl(controls: typeof this.controls, fn: (control: AbstractControl) => void) {
    // Per ogni controllo all'interno di questo gruppo, eseguo una funzione.
    Object.keys(controls).forEach(key => {
      const control = controls[key];
      if (control instanceof FormGroup) {
        // Se il control è un altro gruppo, eseguo la funzione su quel gruppo.
        this._forEachControl(control.controls, fn);
      } else {
        // Altrimenti, eseguo la funzione sul controllo stesso.
        fn(control);
      }
    });
  }

  /**
   * Converte un oggetto JSON in un FormGroupSchema
   *
   * @param jsonObject L'oggetto JSON da convertire in FormGroupSchema.
   * @returns Un FormGroupSchema che rappresenta l'oggetto JSON.
   */
  static fromJSON<T extends string>(jsonObject: GroupSchemaTemplate, userRoles?: T[]): FormGroupSchema<T> {
    const { fields, conditions, key } = jsonObject;
    const formGroup = new FormGroupSchema<T>({ key, fields: [], conditions }, { userRoles });

    Object.entries(fields).forEach(([key, value]) => {
      const isObj = typeof value === "object";
      const isArray = isObj && Array.isArray(value);
      const isControlSchema = isObj && !isArray && value.hasOwnProperty('key') && !value.hasOwnProperty('fields');
      const isGroupSchema = isObj && !isArray && value.hasOwnProperty('fields');
      const isFormGroup = value instanceof FormGroup;
      const isFormArray = value instanceof FormArray;
      const isGroupSchemaInstance = value instanceof FormGroupSchema;
      const isFormControl = value instanceof FormControl;
      const isControlSchemaInstance = value instanceof FormControlSchema;
      const isFormSchemaInstance = isGroupSchemaInstance || isControlSchemaInstance;

      if (isFormSchemaInstance) {
          formGroup.addControl(key, value);
      } else if (isObj) {
        if (isGroupSchema) {
          formGroup.addControl(key, FormGroupSchema.fromJSON<T>(value as GroupSchemaTemplate<T>, userRoles));
        }
        else if (isControlSchema) {
          formGroup.addControl(key, new FormControlSchema<T>(value as ControlSchemaTemplate<T>));
        }
      }
    });

    return formGroup;
  }
}
