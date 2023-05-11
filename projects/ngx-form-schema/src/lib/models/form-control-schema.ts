import { AbstractControl, AsyncValidatorFn, FormArray, FormControl, FormControlOptions, FormGroup, ValidatorFn } from "@angular/forms";
import { BehaviorSubject, shareReplay, Observable, filter, startWith, distinctUntilChanged, Subject, switchMap } from "rxjs";
import { ControlSchema, ControlSchemaAbstract, FormSchemaConditions, FormSchemaFieldOptions, FormSchemaFieldSize, FormSchemaFieldType, FormSchemaPermissionSettings, FormSchemaValidators } from "../types";
import { compile, evalExpr } from 'jse-eval';
import { get } from "../helpers";
import { FormGroupSchema } from "./form-group-schema";
import { CONTROL_SELF_REF } from "../constants";

type TemplateKeys = keyof ControlSchema<string>;

type Writeable<T> = { -readonly [P in keyof T]-?: T[P] };

/**
 * Rappresenta lo schema di un campo di un form, utilizzato per definire le proprietà e il comportamento del campo.
 * Estende la classe `FormControl`.
 *
 * La classe è in grado di gestire campi di tipo `select-box` e offre i metodi `setUserRoles` per registrare i ruoli dell'utente corrente
 * e `setOptions` per settare le opzioni della select-box.
 *
 * Il metodo `checkConditionsAndUpdateState` viene utilizzato per verificare le condizioni e aggiornare lo stato dello schema.
 *
 * @template UserRole il tipo di ruolo utente associato al campo
 */
export class FormControlSchema<UserRole extends string = string> extends FormControl implements ControlSchemaAbstract<UserRole> {

  public readonly label: string = '';
  public readonly placeholder?: string = undefined;
  public readonly hint?: string = undefined;
  public readonly key: string = '';
  public type: FormSchemaFieldType = FormSchemaFieldType.TEXT;
  public readonly readonly: boolean = false;
  public readonly disableWhenNotVisible: boolean = true;
  public readonly size: FormSchemaFieldSize = 'sm';
  public readonly maxLength?: number = undefined;
  public readonly visible: boolean = true;
  public readonly group?: string = undefined;
  public readonly order: number = 0;
  public readonly prefix?: string;
  public readonly dependencies: string[] = [];
  public readonly suffix?: string;
  public readonly permissions: FormSchemaPermissionSettings<UserRole> = {
    read: [],
    write: []
  }
  public readonly validators: FormSchemaValidators = {
    required: false
  }
  public readonly conditions: FormSchemaConditions = {}

  /** Lista di opzioni disponibili. Da usare quando il campo è di tipo *select*. */
  public readonly options$: Observable<FormSchemaFieldOptions[]>;
  public readonly readonly$: Observable<boolean>;
  public readonly visible$: Observable<boolean>;
  public readonly disabled$: Observable<boolean>;

  // private
  private _readonly$: BehaviorSubject<boolean>;
  private _required$: BehaviorSubject<boolean>;
  private _visible$: BehaviorSubject<boolean>;
  private _disabled$: BehaviorSubject<boolean>;
  private _options$ = new BehaviorSubject<FormSchemaFieldOptions[]>([]);
  private _root$ = new Subject<FormControlSchema<UserRole> | FormGroupSchema<UserRole> | AbstractControl>();
  private _userRoles: UserRole[] = [];

  /**
   * @ Constructor
   */
  constructor(
    _template: ControlSchema<UserRole>,
    validatorOrOpts?: FormControlOptions & { userRoles?: UserRole[] } | ValidatorFn | ValidatorFn[] | null | undefined,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null | undefined
  ) {
    const { defaultValue = null, disabled = false, options, userRoles, ...template } = _template;
    super({ value: defaultValue, disabled }, validatorOrOpts, asyncValidator);

    // Assengna template ricevuto all'istanza della classe
    (Object.keys(template) as (Partial<TemplateKeys>)[])
      // esclude campi inesistenti o riservati agli observables
      .filter((key) => key in this && !key.endsWith('$') && !key.startsWith('_'))
      .forEach(key => {
        switch (key) {
          case 'validators':
          case 'conditions':
            Object.assign(this[key], template[key]);
            break;
          case 'defaultValue':
          case 'disabled':
          case 'options':
          case 'userRoles':
            break;
          default:
            (this as any)[key] = template[key];
        }
      });

    this._readonly$ = new BehaviorSubject(this.readonly);
    this._required$ = new BehaviorSubject(this.validators.required ?? false);
    this._visible$ = new BehaviorSubject(this.visible);
    this._disabled$ = new BehaviorSubject(this.disabled);

    if (options) {
      this.setOptions(options);
    }

    if (userRoles) {
      this.setUserRoles(userRoles);
    }

    this.readonly$ = this._readonly$.asObservable().pipe(distinctUntilChanged(), shareReplay({ bufferSize: 1, refCount: false }));
    this.visible$ = this._visible$.asObservable().pipe(distinctUntilChanged(), shareReplay({ bufferSize: 1, refCount: false }));
    this.disabled$ = this._disabled$.asObservable().pipe(distinctUntilChanged(), shareReplay({ bufferSize: 1, refCount: false }));
    this.options$ = this._options$;

    this._visible$
      .pipe(
        filter(() => this.disableWhenNotVisible),
        filter(() => !this.parent || this.parent?.enabled),
        filter(isVisible => isVisible !== this.enabled)
      )
      .subscribe((isVisible) => {
        if (isVisible) this.enable({ emitEvent: false });
        else this.disable({ emitEvent: false });
        this.updateValueAndValidity();
      });

    this._root$.pipe(
      startWith(this.root),
      switchMap(root => root.valueChanges)
    ).subscribe(() => {
      this.checkConditionsAndUpdateState();
    });
  }

  /**
   * Sets the parent of the control
   * @param parent The new parent.
   */
  public override setParent(parent: FormControlSchema<UserRole> | FormGroup | FormArray | null): void;
  public override setParent(parent: FormGroupSchema<UserRole> | FormGroup | FormArray | null): void {
    super.setParent(parent as unknown as FormGroup);

    this._root$.next(this.root);
  }

  /**
   * Sets the field type
   * @param type
   */
  public setFieldType(type: FormSchemaFieldType): void {
    this.type = type;
    this.checkConditionsAndUpdateState();
  }

  /**
   * Registra i ruoli dell'utente corrente
   * @param roles
   */
  public setUserRoles(roles: UserRole[]): void {
    this._userRoles = Array.isArray(roles) ? [...roles] : [];
    this.checkConditionsAndUpdateState();
  }

  /**
   * Setta opzioni per la select-box
   * @param options accetta un observable o una lista di opzioni
   */
  public setOptions(options: FormSchemaFieldOptions[] | Observable<FormSchemaFieldOptions[]>) {
    if (options instanceof Observable) {
      options.subscribe(this._options$);
    } else {
      this._options$.next([...options]);
    }
  }

  /**
   * Verifica le condizioni e aggiorna lo stato dello schema
   * @param dataSrc
   */
  public checkConditionsAndUpdateState(dataSrc?: Record<string, any>) {
    const src = typeof dataSrc === 'object'
      ? dataSrc
      : typeof this.root?.getRawValue() === 'object'
        ? this.root.getRawValue()
        : null;

    const filterDepsSrc = this._filterDepsSrc(src);

    this.refreshReadonly(filterDepsSrc);
    this.refreshVisibility(filterDepsSrc);
    this.refreshRequired(filterDepsSrc);
    this.refreshValue(filterDepsSrc);
    this.refreshValidity(filterDepsSrc);
  }

  /**
   * Aggiorna la validità del campo in base alla sorgente dati e alle condizioni fornite.
   *
   * @param {Record<string, any>} dataSrc - La sorgente dati da utilizzare durante l'elaborazione delle condizioni.
   */
  public refreshValidity(dataSrc: Record<string, any> | null) {
    if (this.disabled) return;

    const catchedError =
      (this.type === FormSchemaFieldType.NUMBER && this._validateNumber(dataSrc))
      || (this.type === FormSchemaFieldType.DATE && this._validateDate(dataSrc))
      || this._validateRequired();

    this.setErrors(catchedError);
  }

  /**
   * Aggiorna lo stato di `required` dell'istanza corrente in base alla sorgente dati e alle condizioni fornite.
   *
   * @param {Record<string, any>} dataSrc - La sorgente dati da utilizzare durante l'elaborazione delle condizioni.
   */
  public refreshRequired(dataSrc: Record<string, any> | null): void {
    if (this._noDependencies() || this.disabled) this._required$.next(this.validators.required ?? false);
    else {
      const isRequired = this._evaluateConditions(this.conditions.requiredIf ?? '', dataSrc, this.validators.required);
      const hasChanged = this._required$.getValue() !== isRequired;

      if (hasChanged) this._required$.next(isRequired);
    }
  }


  /**
   * Aggiorna lo stato di `readonly` dell'istanza corrente in base alla sorgente dati e alle condizioni fornite.
   *
   * @param {Record<string, any>} dataSrc - La sorgente dati da utilizzare durante l'elaborazione delle condizioni.
   */
  public refreshReadonly(dataSrc: Record<string, any> | null): void {
    const canWrite = this._userHasWritePerms();

    if (!canWrite) {
      this._readonly$.next(true);
    }
    else if (!this._noDependencies() && this.conditions.readonlyIf) {
      const next = this._evaluateConditions(this.conditions.readonlyIf, dataSrc, this.readonly);
      this._readonly$.next(next);
    }
    else this._readonly$.next(this.readonly);
  }

  /**
   * Aggiorna la visibilità secondo le condizioni impostate
   *
   * @param {Record<string, any>} dataSrc - La sorgente dati da utilizzare durante l'elaborazione delle condizioni.
   */
  public refreshVisibility(dataSrc: Record<string, any> | null): void {
    const canRead = this._userHasReadPerms();

    if (!canRead) this._visible$.next(false);
    else if (!this._noDependencies() && this.conditions.showIf) {
      const next = this._evaluateConditions(this.conditions.showIf, dataSrc, this.visible);
      this._visible$.next(next);
    }
    else this._visible$.next(this.visible);
  }

  /**
   * Aggiorna il valore del control corrente in base alla sorgente dati
   * e alle condizioni fornite.
   *
   * @param {Record<string, any>} dataSrc - La sorgente dati da utilizzare durante l'elaborazione delle condizioni.
   */
  public refreshValue(dataSrc: Record<string, any> | null): void {
    if (this._noDependencies()) return;

    const conditions = this.conditions?.useValuesIf;

    if (!conditions) return;
    if (typeof conditions !== 'object') return;
    if (Array.isArray(conditions) && !this._isArrayofObjects(conditions)) return;

    let nextValue = [conditions].flat().find(({ condition }) => this._evaluateConditions(condition, dataSrc, false) === true)?.value;

    if (nextValue === undefined) return;

    // in caso di stringa viene valutata come espressione per individuare un eventuale path.
    if (typeof nextValue === 'string' && !!dataSrc) {
      nextValue = evalExpr(nextValue, dataSrc);
    }

    if (nextValue == this.getRawValue()) return;

    this.setValue(nextValue);
  }

  /**
   * Verifica se il valore passato è un array di oggetti.
   *
   * @private
   * @param {any} value - Il valore da verificare.
   * @returns {boolean} - Un valore booleano che indica se il valore passato è un array di oggetti.
   */
  private _isArrayofObjects(value: any): boolean {
    return Array.isArray(value) && !value.some(item => typeof item !== 'object');
  }

  /**
   * Verifica se l'istanza corrente non ha dipendenze.
   *
   * @private
   * @returns {boolean} - Un valore booleano che indica se l'istanza corrente non ha dipendenze.
   */
  private _noDependencies(): boolean {
    return this.dependencies.length === 0;
  }

  /**
   * Verifica se l'utente può leggere il campo
   *
   * @private
   * @returns {boolean} - Un valore booleano che indica se l'utente può leggere il campo.
   */
  private _userHasReadPerms(): boolean {
    const { read: readRoles } = this.permissions;
    return readRoles?.length === 0 || this._userRoles.some(userRole => readRoles.includes(userRole));
  }

  /**
   * Ritorna 'true' se l'utente può scrivere il campo
   * @returns
   */
  private _userHasWritePerms(): boolean {
    const { write: writeRoles } = this.permissions;
    return writeRoles?.length === 0 || this._userRoles.some(userRole => writeRoles.includes(userRole));
  }

  /**
   * Valuta le condizioni passate e ritorna l'esito
   * @param expression
   * @param dataSrc
   * @param fallback Valore da ritornare in assenza di condizioni
   * @returns {boolean}
   */
  private _evaluateConditions(expression: string, dataSrc: Record<string, any> | null, fallback: boolean = true): boolean {
    if (!expression || typeof expression !== 'string') return fallback;

    const sanitizedExp = this.dependencies.reduce((exp, dep) => {
      if (dep === CONTROL_SELF_REF) {
        return this._replaceWithValue(exp, dep, this.getRawValue());
      } else {
        return !!dataSrc
          ? this._replaceWithValue(exp, dep, dataSrc[dep])
          : expression
      }
    },
      expression);

    try {
      return evalExpr(sanitizedExp) as boolean;
    } catch (e) {
      return fallback;
    }
  }

  /**
   * Replaces all occurrences in the given expression with the given value.
   * @private
   * @param {string} expression - The expression to replace self references in.
   * @param {string} target
   * @param {any} value - The value to replace self references with.
   * @returns {string} The expression with self references replaced with the given value.
   */
  private _replaceWithValue(expression: string, target: string, value: any): string {
    const sanitizedValue = typeof value === 'string' ? `'${value}'` : value;
    const regex = new RegExp(`(?<=\\b)(?:${target})(?![\\w'"])(?=[^'"]*)`, 'gm');
    return expression.replace(regex, sanitizedValue);
  }

  /** Filtra il sorgente in base alle dipendenze dichiarate */
  private _filterDepsSrc(dataSrc: Record<string, any>): { [key: string]: any } | null {
    return !!dataSrc ? this.dependencies.reduce((acc, curDep) => ({
      ...acc, ...(() =>
        curDep && curDep !== CONTROL_SELF_REF ? ({ [curDep]: get(dataSrc, curDep, null) }) : {}
      )()
    }), {}) : null
  }

  /**
   * Metodo privato per il controllo della validità delle date.
   */
  private _validateDate(dataSrc: { [key: string]: any } | null):
    | { min: { min: number | Date; actual: number | Date; }; }
    | { max: { max: number | Date; actual: number | Date; }; }
    | null {
    return dataSrc === null ? null : this._validateMin(dataSrc) || this._validateMax(dataSrc);
  }

  /**
   * Metodo privato per il controllo della validità di valori numerici.
   */
  private _validateNumber(dataSrc: { [key: string]: any } | null):
    | { max: { max: number | Date; actual: any; }; }
    | { min: { min: number | Date; actual: any; }; }
    | null {
    return dataSrc === null ? null : this._validateMin(dataSrc) || this._validateMax(dataSrc);
  }

  /**
   * Verifica se il valore supera il limite minimo definito
   * @param {any} dataSrc - L'oggetto di dati da utilizzare per la compilazione del valore minimo.
   */
  private _validateMin(dataSrc: { [key: string]: any; }): { min: { min: number | Date; actual: number | Date; }; } | null {
    if (this.validators.min !== undefined) {
      if (typeof this.validators.min === 'string' && this._noDependencies())
        return null;
      else {
        const minValue = typeof this.validators.min === 'string' ? compile(this.validators.min)(dataSrc) as number | Date : this.validators.min;
        const isValid = this.value >= minValue;

        return !isValid ? { min: { min: minValue, actual: this.value } } : null;
      }
    }
    return null;
  }

  /**
   * Verifica se il valore supera il limite massimo definito
   * @param {any} dataSrc - L'oggetto di dati da utilizzare per la compilazione del valore massimo.
   */
  private _validateMax(dataSrc: { [key: string]: any }): { max: { max: number | Date; actual: number | Date; }; } | null {
    if (this.validators.max !== undefined) {
      if (typeof this.validators.max === 'string' && this._noDependencies())
        return null;
      else {
        const maxValue = typeof this.validators.max === 'string' ? compile(this.validators.max)(dataSrc) as number | Date : this.validators.max;
        const isValid = this.value <= maxValue;

        return !isValid ? { max: { max: maxValue, actual: this.value } } : null;
      }
    }
    return null
  }

  /**
   * Verifica se il valore è vuoto.
   * @returns Un oggetto con una proprietà 'required' impostata su true se il valore è vuoto o null, o null se il valore non è vuoto.
   */
  private _validateRequired(): { required: boolean; } | null {
    const isReadonly = this._readonly$.getValue();
    const isRequired = this._required$.getValue();
    const isEmpty = !this.value && isNaN(parseInt(this.value));
    return !isReadonly && isRequired && isEmpty ? { required: true } : null;
  }
}
