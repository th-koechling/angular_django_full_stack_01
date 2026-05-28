import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditingNotesComponent } from './editing-notes.component';

describe('EditingNotesComponent', () => {
  let component: EditingNotesComponent;
  let fixture: ComponentFixture<EditingNotesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditingNotesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditingNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
