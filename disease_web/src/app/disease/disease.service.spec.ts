import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment.development';
import { Disease, Panel, DiseasePanel, EditingNote } from './interfaces';
import { DiseaseService } from './disease.service';


describe("DiseaseService", () => {
   let service: DiseaseService;
   let httpMock: HttpTestingController;
   const baseUrl = environment.apiUrl;

   beforeEach(() => { 
      TestBed.configureTestingModule({
         imports: [HttpClientTestingModule],
         providers: [DiseaseService]
      });

      service = TestBed.inject(DiseaseService);
      httpMock = TestBed.inject(HttpTestingController);
   });

   afterEach(() => {
      httpMock.verify();
   });

   // TESTS:
   it('should be created', () => {
      console.log("baseUrl:", baseUrl);
      expect(service).toBeTruthy();
   });

   describe('isUserLoggedIn()', () => {
      it('should return a boolean value', () => {
         const result = service.isUserLoggedIn();
         expect(typeof result).toBe('boolean');
      });
   });

});

