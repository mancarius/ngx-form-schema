import { Observable } from "rxjs";
import { FormControlSchema } from "./models/form-control-schema";
import { FormGroupSchema } from "./models/form-group-schema";
import { FormArraySchema } from "./models/form-array-schema";


export enum FormSchemaFieldType {
  TEXT = 'text',
  SELECT = 'select',
  NUMBER = 'number',
  TEXTAREA = 'textarea',
  CHECKBOX = 'checkbox',
  TELEPHONE = 'tel',
  DATE = 'date',
  TIME = 'time',
  DATETIME = 'datetime-local',
  PASSWORD = 'password',
  WEEK = 'week',
  MONTH = 'month',
  URL = 'url',
  RANGE = 'range',
  RADIO = 'radio',
  SEARCH = 'search',
  EMAIL = 'email',
  COLOR = 'color',
}


export type FormSchemaFieldSize = 'sm' | 'md' | 'lg' | 'full';


export type ComparisonOperator = "==" | "!=" | "<" | ">" | "<=" | ">=";


export type UseValueCondition = {
  /**
   * Value to be assigned to the field.
   * It is possible to insert the value directly (in case of a string, enclose it in single quotes).
   * It is also possible to insert the reference property path.
   * @example
   * ```
   * value: 'path.to.field'
   * ```
   */
  value: any,
  /**
   * Conditions that must be met for the assigned value to be set
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
 * The permission settings that define which roles have access for reading or writing.
 */
export type FormSchemaPermissionSettings<T extends string> = {
  /** List of roles with read permissions. If the list is empty, it means that no role is required.. */
  read: T[];
  /** List of roles with write permissions. If the list is empty, it means that no role is required. */
  write: T[];
};


export type FormSchemaFieldOptions = {
  label: string;
  value: string | number | boolean;
};


export type FormSchemaValidators = {
  /** Indicate whether the field is mandatory. */
  required?: boolean;
  /**
   * Minimum allowed number. It is only taken into account if the field is of type 'number' or 'date'.
   * It is possible to insert the path of the reference property.
   * @example
   * ```
   * min: 'path.to.field'
   * ```
   * Where 'field' must be of type 'number'.
   */
  min?: number | string | Date,
  /**
   * Maximum allowed number. It is only taken into account if the field is of type 'number' or 'date'.
   * It is possible to insert the path of the reference property.
   * @example
   * ```
   * min: 'path.to.field'
   * ```
   * Where 'field' must be of the same type as the field.
   */
  max?: number | string | Date,

  // TODO: implement validation by pattern
  // pattern?: string
};


export type FormSchemaConditions = {
  /**
   * Conditional visibility.
   * The referenced fields must exist within the *dependencies* property.
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
   * Conditional required.
   * The referenced fields must exist within the *dependencies* property.
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
   * Conditional readonly.
   * The referenced fields must exist within the *dependencies* property.
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
   * Set the value of the field conditionally.
   * Accept a list of conditions
   */
  useValuesIf?: UseValueCondition | UseValueCondition[];
};

type ControlSchemaValueType<TField extends FormSchemaFieldType> =
  TField extends FormSchemaFieldType.NUMBER ? number :
  TField extends FormSchemaFieldType.CHECKBOX ? boolean :
  TField extends FormSchemaFieldType.SELECT ? string | number | boolean :
  string;

/**
 * The template that defines the schema of the field, including validation, display settings, etc.
 */
export type ControlSchemaAbstract<UserRole extends string = string, T = any> = {
  /** Field label */
  label: string;
  /** Field placeholder */
  placeholder?: string;
  /** field hint */
  hint?: string;
  /** Unique key of the field within the form */
  key: string;
  /** Field type, as defined in the `FormSchemaFieldType` enumeration */
  type: FormSchemaFieldType;
  /** Default value */
  defaultValue: T | null;
  /** Indicates whether the field is read-only */
  readonly?: boolean;
  /** Indicates if the field is disabled. When it is disabled it is not validated. */
  disabled?: boolean;
  /** Indicates whether the field should be disabled when not visible. Default value is 'true' */
  disableWhenNotVisible?: boolean;
  /** Indicates the size of the field, as defined in the `FormSchemaFieldSize` enumeration. You can use this field to value the style class of the component. */
  size?: FormSchemaFieldSize;
  /** Indicates the maximum length of the string. Only valid for `TEXT` and `TEXTAREA` fields */
  maxLength?: number;
  /** Indicates whether the field should be visible or not */
  visible?: boolean;
  /** Name of the group the field belongs to */
  group?: string;
  /** Options to use in case of select-box or radio */
  options?: FormSchemaFieldOptions[] | Observable<FormSchemaFieldOptions[]>;
  /** Indicates the display order of the field within its group */
  order?: number;
  /** Field prefix */
  prefix?: string;
  /**
   * Key or path to the fields that affect the behavior of this field.
   * @example
   * Example of dependencies
   * ```
   * ['path.to.field', 'anotherField']
   * ```
  */
  dependencies?: string[];
  /** Field suffix */
  suffix?: string;
  /** Permission settings */
  permissions?: FormSchemaPermissionSettings<UserRole>;
  /** Current user permissions */
  userRoles?: UserRole[];
  /** Validators */
  validators?: FormSchemaValidators;
  /** Optional condition list */
  conditions?: FormSchemaConditions
  /** The HTMLElement properties */
  props?: { [key: string]: any }
}


export type ControlSchema<UserRole extends string = string, T = string | number | boolean> =
  | ControlSchemaAbstract<UserRole, number> & { type: FormSchemaFieldType.NUMBER | FormSchemaFieldType.RANGE }
  | ControlSchemaAbstract<UserRole, boolean> & { type: FormSchemaFieldType.CHECKBOX }
  | ControlSchemaAbstract<UserRole, T> & { type: FormSchemaFieldType.SELECT | FormSchemaFieldType.RADIO }
  | ControlSchemaAbstract<UserRole, string> & { type: Omit<FormSchemaFieldType, 'NUMBER' | 'RANGE' | 'CHECKBOX' | 'SELECT' | 'RADIO'> };


export type AbstractSchema = {
  conditions?: {},
  key?: string
}


export type GroupSchema<UserRole extends string = string, T extends { [K in keyof T]: ControlOrGroupSchema<UserRole> | FormControlOrGroupSchema } = {}> =
  AbstractSchema & { fields: { [K in keyof T]: ControlOrGroupSchema<UserRole> | FormControlOrGroupSchema }; }


export type ArraySchema<UserRole extends string = string> =
  AbstractSchema & { fields: (ControlOrGroupSchema<UserRole> | FormControlOrGroupSchema<UserRole>)[] };


export type ControlOrGroupSchema<UserRole extends string = string, T extends { [K in keyof T]: any } = any> = ControlSchema<UserRole> | GroupSchema<UserRole, T> | ArraySchema<UserRole>;


export type FormSchemaElement<T extends FormControlOrGroupSchema, R extends string = string> =
  T extends FormControlSchema ? FormControlSchema<R> :
  T extends FormGroupSchema ? FormGroupSchema<R> :
  T extends FormArraySchema ? FormArraySchema<R> :
  never;


export type FormControlOrGroupSchema<UserRole extends string = string> = FormControlSchema<UserRole> | FormGroupSchema<UserRole> | FormArraySchema<UserRole>;


export type GroupSchemaControls<
  UserRole extends string,
  T extends { [K in keyof T]: FormSchemaElement<FormControlOrGroupSchema, UserRole> } = {}
> = AbstractSchema & { fields: T };


export type ArraySchemaControls<
  UserRole extends string,
  T extends FormSchemaElement<FormControlOrGroupSchema, UserRole>[] = []
> = AbstractSchema & { fields: T };
