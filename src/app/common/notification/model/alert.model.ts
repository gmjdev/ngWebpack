export class Alert {
    constructor(
        public id: number,
        public msg: string,
        public type: string,
        public active: boolean = false,
        public cancellable: boolean = true,
        public alertIconCls: string = 'fa fa-bullhorn fa-2x',
    ) { }
}
