import { AbstractControl } from "@angular/forms";
import { FormArraySchema } from "../models/form-array-schema";
import { FormGroupSchema } from "ngx-form-schema";

/**
 * Esegue una funzione per ogni controllo all'interno del gruppo.
 *
 * @param fn Funzione da eseguire per ogni controllo.
 */
export const forEachControl = (controls: AbstractControl<any, any>[] | Record<string, AbstractControl<any, any>>, fn: (control: AbstractControl) => void) => {
  // Per ogni controllo all'interno di questo gruppo, eseguo una funzione.
  Object.values(controls).forEach(control => {
    if (control instanceof FormGroupSchema || control instanceof FormArraySchema) {
      // Se il control è un altro gruppo, eseguo la funzione su quel gruppo.
      forEachControl(control.controls, fn);
    } else {
      // Altrimenti, eseguo la funzione sul controllo stesso.
      fn(control);
    }
  });
}
