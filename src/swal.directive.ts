import { Directive, EventEmitter, HostListener, Inject, Input, Output } from '@angular/core';
import swal, { SweetAlertOptions, SweetAlertType } from 'sweetalert2';
import { SWAL_DEFAULTS } from './di';

export type SimpleSweetAlertOptions = Array<string|SweetAlertType>;

@Directive({ selector: '[swal]' })
export class SwalDirective {
    @Input() public set swal(options: SweetAlertOptions|SimpleSweetAlertOptions) {
        if (Array.isArray(options)) {
            [this.modalOptions.title, this.modalOptions.text] = options;

            if (options.length >= 3) {
                this.modalOptions.type = options[2] as SweetAlertType;
                this.event = options.event ? options.event : 'click';
            }
        } else {
            this.modalOptions = options;
        }
    }

    @Output() public confirm: EventEmitter<any> = new EventEmitter();

    @Output() public cancel: EventEmitter<any> = new EventEmitter();

    private modalOptions: SweetAlertOptions = {};
    private event: any = 'click';

    public constructor(@Inject(SWAL_DEFAULTS) private defaultSwalOptions: SweetAlertOptions) {}

    @HostListener(this.event, ['$event']) public onHostClicked(event: MouseEvent): void {
        event.preventDefault();
        event.stopImmediatePropagation();

        const options = Object.assign({}, this.defaultSwalOptions, this.modalOptions);

        swal(options).then(
            (success) => this.confirm.emit(success),
            (dismiss) => this.cancel.emit(dismiss)
        );
    }
}
