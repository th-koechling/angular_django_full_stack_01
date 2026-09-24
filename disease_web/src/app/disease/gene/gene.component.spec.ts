import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { GeneComponent } from './gene.component'; 


describe('GeneComponent', () => {
    let component: GeneComponent;
    let fixture: ComponentFixture<GeneComponent>;
    let geneServiceSpy: any;
    let httpClientSpy: any;

    beforeEach(async () => {

        geneServiceSpy = jasmine.createSpyObj('GeneService', ['getGenes', 'createGene', 'updateGene']);
        httpClientSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put']);

        await TestBed.configureTestingModule({
            imports: [GeneComponent, HttpClientModule],
            providers: [
                { provide: 'GeneService', useValue: geneServiceSpy },
                { provide: 'HttpClient', useValue: httpClientSpy }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(GeneComponent);
        component = fixture.componentInstance;
        await fixture.whenStable();
    });

    it ('should create', () => {
        expect(component).toBeDefined();
    });
});
