export class Weather {
    constructor(
        public id: number,
        public name: string,
        public cod: string,
        public humidity: number,
        public pressure: number,
        public temp: number,
        /* tslint:disable:variable-name */
        public temp_max: number,
        /* tslint:disable:variable-name */
        public temp_min: number) { }
}
