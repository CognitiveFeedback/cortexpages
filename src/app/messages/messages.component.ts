import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DataService } from '../services/data-service.service';
import { Message } from '../models/message.model';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {

  messages: Message[] = [];
  submitted = false;

  constructor(private formBuilder: FormBuilder, private router: Router,
    private dataService: DataService) { }

  ngOnInit() {
    this.dataService.getMessages().subscribe(a => {
      this.messages = a;
    });
  }  
}
