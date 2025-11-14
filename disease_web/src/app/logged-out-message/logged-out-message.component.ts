import { Component, Output, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-logged-out-message',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './logged-out-message.component.html',
  styleUrl: './logged-out-message.component.css'
})
export class LoggedOutMessageComponent implements OnInit { 
  // enforce max length of 48 characters, how to do that?
  @Output() onScreenMsg: string = "Please log in to use the software blah blah blah";
  ngOnInit() {
    window.location.reload
  } 
}
