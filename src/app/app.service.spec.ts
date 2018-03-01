import { AppService } from './app.service';

describe('AppService Tests', () => {
    let service;
    beforeEach(() => {
        service = new AppService();
    });


    it('Should return a list of dogs', () => {
        let items = service.getDogs(4);
        expect(items).toEqual(['golden retriever', 'french bulldog',
            'german shepherd', 'alaskan husky']);
    });

    it('Should get all dogs available', () => {
        let items = service.getDogs(100);

        expect(items).toEqual(['golden retriever', 'french bulldog',
            'german shepherd', 'alaskan husky', 'jack russel terrier',
            'boxer', 'chow chow', 'pug', 'akita', 'corgi', 'labrador']);
    });
});
