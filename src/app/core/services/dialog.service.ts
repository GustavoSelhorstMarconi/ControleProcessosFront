import { DOCUMENT } from '@angular/common';
import {
  Injectable,
  inject,
  ApplicationRef,
  EnvironmentInjector,
  Type,
  ComponentRef,
  Injector,
  createComponent,
} from '@angular/core';
import { Subject } from 'rxjs';
import { ParamsDialog } from '../../shared/models/params-dialog';

export abstract class DialogRef {
  abstract close(value: unknown): void;
  abstract open(): ParamsDialog | null;
}

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  applicationRef = inject(ApplicationRef);
  environmentInjector = inject(EnvironmentInjector);
  document = inject(DOCUMENT);

  open<T>(component: Type<T>, params: ParamsDialog | null) {
    const container = this.document.createElement('dialog-container');
    this.document.body.appendChild(container);

    let componentRef: ComponentRef<T>;

    const afterClosed$ = new Subject();

    const dialogRef: DialogRef = {
      close: (value: unknown) => {
        this.applicationRef.detachView(
          (componentRef as ComponentRef<T>).hostView
        );
        (componentRef as ComponentRef<T>).destroy();
        container.remove();

        afterClosed$.next(value);
      },
      open: () => {
        return params;
      }
    };

    const dialogInjector = Injector.create({
      providers: [
        {
          provide: DialogRef,
          useValue: dialogRef,
        },
      ],
    });

    componentRef = createComponent(component, {
      environmentInjector: this.environmentInjector,
      hostElement: container,
      elementInjector: dialogInjector,
    });

    this.applicationRef.attachView(componentRef.hostView);

    return {
      afterClosed: () => afterClosed$.asObservable(),
    };
  }
}