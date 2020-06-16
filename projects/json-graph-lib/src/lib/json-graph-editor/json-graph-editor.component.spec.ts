import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JsonGraphEditorComponent } from './json-graph-editor.component';

describe('JsonGraphEditorComponent', () => {
  let component: JsonGraphEditorComponent;
  let fixture: ComponentFixture<JsonGraphEditorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JsonGraphEditorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonGraphEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
