import { browser, by, element } from "protractor";

describe('App', () => {
    beforeEach(() => {
        browser.get('/');
    });

    it('should have a title', () => {
        let subject = browser.getTitle();
        let result = 'Angular 4 + Webpack 2 + Gulp 2';
        expect<any>(subject).toEqual(result);
    });

    it('should have header', () => {
        let subject = element(by.css('.navbar-brand')).isPresent();
        let result = true;
        expect<any>(subject).toEqual(result);
    });

    it('should have header name', () => {
        let subject = element(by.css('.navbar-brand')).isPresent();
        let result = false;
        expect<any>(subject).toEqual(!result);
    });
});
