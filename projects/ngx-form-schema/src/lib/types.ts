import { FormGroup } from '@angular/forms';
import { AbstractControl, FormControl } from '@angular/forms';
import { Observable } from "rxjs";
import { FormFieldSchema } from "./form-field-schema";
import { FormGroupSchema } from "./form-group-schema";

export enum FormSchemaFieldType {
  TEXT = 'text',
  SELECT = 'select',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  TELEPHONE = 'tel',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime'
}

export type FormSchemaFieldSize = 'sm' | 'md' | 'lg' | 'full';

export type ComparisonOperator = "==" | "!=" | "<" | ">" | "<=" | ">=";

export type UseValueCondition = {
  /**
   * Valore da assegnare al campo. E' possibile inserire direttamente il valore da assegnare al campo (in caso di stringa inserirla tra apici singoli).
   * E' possibile inserire il percorso della proprietà di riferimento.
   * @example
   * ```
   * value: 'path.to.field'
   * ```
   */
  value: any,
  /**
   * Condizioni che devono essere rispettate per l'assegnazione del valore impostato
   * @example
   * ```
   * ```
   * path.to.field=='Foo'
   * ```
   * ```
   * path.to.field1=='Foo' || path.to.field2=='Bar' || ...
   * ```
   * ```
   * path.to.field!=1 && path.to.field!=2 && ...
   * ```
   */
  condition: string
};

/**
 * Le impostazioni dei permessi che definiscono quali ruoli hanno accesso in lettura o in scrittura
 */
export type FormSchemaPermissionSettings<T extends string> = {
  /** Lista ruoli con permessi in lettura. Se la lista rimane vuota indica che non è richiesto alcun ruolo. */
  read: T[];
  /** Lista ruoli con permessi in scrittura. Se la lista rimane vuota indica che non è richiesto alcun ruolo. */
  write: T[];
};

export type FormSchemaFieldOptions = {
  label: string;
  value: string | number | boolean;
};

export type FormSchemaValidators = {
  /** Indica se il campo è obbligatorio */
  required?: boolean;
  /** Numero minimo consentito. Viene preso in considerazione solo se il campo è di tipo 'number' o 'date'.
   * E' possibile inserire il percorso della proprietà di riferimento.
   * @example
   * ```
   * min: 'path.to.field'
   * ```
   * Dove 'field' deve essere di tipo 'number'.
   * */
  min?: number | string | Date,
  /** Numero massimo consentito. Viene preso in considerazione solo se il campo è di tipo 'number' o 'date'.
   * E' possibile inserire il percorso della proprietà di riferimento.
   * @example
   * ```
   * min: 'path.to.field'
   * ```
   * Dove 'field' deve essere dello stesso tipo del campo.
   * */
  max?: number | string | Date,
};

export type FormSchemaConditions = {
  /**
   * Visibilità condizionale.
   * I campi a cui si fa riferimento devono essere presenti all'interno della proprieta *dependencies*.
   * @example
   * ```
   * ```
   * "path.to.field=='Foo'"
   * ```
   * ```
   * "path.to.field1=='Foo' || path.to.field2=='Bar' || ..."
   * ```
   * ```
   * "path.to.field!=1 && path.to.field!=2 && ..."
   * ```
   */
  showIf?: string;
  /**
   * Validazione campo opzionale.
   * I campi a cui si fa riferimento devono essere presenti all'interno della proprieta *dependencies*.
   * @example
   * ```
   * "path.to.field=='Foo'"
   * ```
   * ```
   * "path.to.field1=='Foo' || path.to.field2=='Bar' || ..."
   * ```
   * ```
   * "path.to.field!=1 && path.to.field!=2 && ..."
   * ```
   */
  requiredIf?: string;
  /**
   * Imposta stato di sola lettura condizionale.
   * @example
   * ```
   * "path.to.field=='Foo'"
   * ```
   * ```
   * "path.to.field1=='Foo' || path.to.field2=='Bar' || ..."
   * ```
   * ```
   * "path.to.field!=1 && path.to.field!=2 && ..."
   * ```
   */
  readonlyIf?: string;
  /**
   * Imposta il valore del campo in modo condizionale.
   * Accetta una lista di condizioni
   */
  useValuesIf?: UseValueCondition | UseValueCondition[];
};

/**
 * Il template che definisce lo schema del campo, compreso di validazione, impostazioni di visualizzazione, ecc.
 */
export type FieldSchemaTemplate<UserRole extends string = ''> = {
  /** Etichetta del campo */
  label: string;
  /** Testo placeholder del campo */
  placeholder?: string;
  /** Suggerimento del campo */
  hint?: string;
  /** Chiave univoca del campo all'interno del form */
  key: string;
  /** Tipo di campo, come definito nell'enumerazione `FormSchemaFieldType` */
  type: FormSchemaFieldType;
  /** Valore iniziale */
  defaultValue: string | number | boolean | null;
  /** Indica se il campo è in sola lettura */
  readonly?: boolean;
  /** Campo disabilitato e non validabile */
  disabled?: boolean;
  /** Indica se il campo deve essere disabilitato quando non è visibile. Il valore di default è 'true' */
  disableWhenNotVisible?: boolean;
  /** Indica la grandezza del campo, come definito nell'enumerazione `FormSchemaFieldSize` */
  size?: FormSchemaFieldSize;
  /** Indica la lunghezza massima della stringa. Valido solo per i campi di tipo `TEXT` e `TEXTAREA` */
  maxLength?: number;
  /** Indica se il campo dev'essere visibile o meno */
  visible?: boolean;
  /** Indica il gruppo di appartenenza del campo */
  group?: string;
  /** Opzioni da usare in caso di select-box */
  options?: FormSchemaFieldOptions[] | Observable<FormSchemaFieldOptions[]>;
  /** Indica l'ordine di visualizzazione del campo all'interno del proprio gruppo */
  order?: number;
  /** Prefisso campo */
  prefix?: string;
  /** Chiave o percorso dei campi che influenzano il comportamento di questo campo.
   * @example
   * Esempio di dipendenze
   * ```
   * ['path.to.field', 'anotherField']
   * ```
  */
  dependencies?: string[];
  /** Suffisso campo */
  suffix?: string;
  /** Impostazioni permessi */
  permissions?: FormSchemaPermissionSettings<UserRole>;
  /** Permessi utente corrente */
  userRoles?: UserRole[];
  /** Lista di valdatori */
  validators?: FormSchemaValidators;
  /** Elenco condizioni opzionali */
  conditions?: FormSchemaConditions
}

export type FormGroupSchemaTemplate<UserRole extends string = ''> = {
  conditions?: {},
  fields:
  | FormFieldSchema<UserRole>[]
  | { [key: string]: FormControl<any> | FormGroup<any> | FormFieldSchema<UserRole> | FormGroupSchema<UserRole> | FieldSchemaTemplate<UserRole> }
};
